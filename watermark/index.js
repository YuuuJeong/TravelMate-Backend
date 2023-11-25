import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

import { Readable } from 'stream';

import sharp from 'sharp';
import util from 'util';

const s3 = new S3Client({ region: 'ap-northeast-2' });

const resize = async (srcBucket, srcKey) => {
  const dstKey = 'resized-' + srcKey;

  const typeMatch = srcKey.match(/\.([^.]*)$/);
  if (!typeMatch) {
    console.log('Could not determine the image type.');
    return;
  }

  const imageType = typeMatch[1].toLowerCase();
  if (imageType != 'jpg' && imageType != 'png' && imageType != 'jpeg') {
    console.log(`Unsupported image type: ${imageType}`);
    return;
  }

  try {
    const params = {
      Bucket: srcBucket,
      Key: srcKey,
    };
    var response = await s3.send(new GetObjectCommand(params));
    var stream = response.Body;

    if (stream instanceof Readable) {
      var content_buffer = Buffer.concat(await stream.toArray());
    } else {
      throw new Error('Unknown object stream type');
    }
  } catch (error) {
    console.log(error);
    return;
  }

  const width = 200;

  try {
    var output_buffer = await sharp(content_buffer).resize(width).toBuffer();
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    const destparams = {
      Bucket: srcBucket,
      Key: dstKey,
      Body: output_buffer,
      ContentType: 'image',
    };

    await s3.send(new PutObjectCommand(destparams));
  } catch (error) {
    console.log(error);
    return;
  }

  console.log(
    'Successfully resized ' +
      srcBucket +
      '/' +
      srcKey +
      ' and uploaded to ' +
      dstBucket +
      '/' +
      dstKey,
  );
};

export const handler = async (event, context) => {
  console.log(
    'Reading options from event:\n',
    util.inspect(event, { depth: 5 }),
  );
  const srcBucket = event.Records[0].s3.bucket.name;

  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' '),
  );

  if (srcKey.startsWith('thumbnail/')) {
    resize(srcBucket, srcKey);
    return;
  }
};
