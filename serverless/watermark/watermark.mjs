import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

import { Readable } from 'stream';

import util from 'util';
import fs from 'fs';
import jimp from 'jimp';

const s3 = new S3Client({ region: 'ap-northeast-2' });

const watermark = async (srcBucket, srcKey) => {
  try {
    const params = {
      Bucket: srcBucket,
      Key: srcKey,
    };

    const originalImage = await s3.send(new GetObjectCommand(params));
    const stream = originalImage.Body;

    if (stream instanceof Readable) {
      var content_buffer = Buffer.concat(await stream.toArray());
    } else {
      throw new Error('Unknown object stream type');
    }

    const logoBuf = await fs.promises.readFile('./logo.jpg');

    const [image, logo] = await Promise.all([
      jimp.read(content_buffer),
      jimp.read(logoBuf),
    ]);

    logo.resize(image.bitmap.width / 3, jimp.AUTO);

    const x = image.bitmap.width - logo.bitmap.width - 10;
    const y = image.bitmap.height - logo.bitmap.height - 10;

    image.composite(logo, x, y, {
      mode: jimp.BLEND_SOURCE_OVER,
      opacitySource: 0.3,
    });

    const output_buffer = await image.getBufferAsync(jimp.MIME_JPEG);

    const destKey = srcKey.replace('article', 'watermarked/article');

    const destparams = {
      Bucket: srcBucket,
      Key: destKey,
      Body: output_buffer,
      ContentType: 'image',
    };

    await s3.send(new PutObjectCommand(destparams));
    console.log('Successfully watermarked ' + srcBucket + '/' + srcKey);

    const response = {
      status: '302',
      statusDescription: 'Found',
      headers: {
        location: [
          {
            key: 'Location',
            value: 'https://d1xeo9u48cowhw.cloudfront.net/' + destKey,
          },
        ],
      },
    };

    return response;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const handler = async (event, context) => {
  console.log(
    'Reading options from event:\n',
    util.inspect(event, { depth: 5 }),
  );

  const request = event.Records[0].cf.request;
  const srcKey = request.uri.substring(1);

  if (srcKey.startsWith('article')) {
    const res = await watermark('travelmate-prod', srcKey);
    return res;
  }
};
