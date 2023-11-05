import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  findAllTags() {
    return this.prisma.tag.findMany();
  }

  searchTagsByName(name: string) {
    if (
      [
        'ㄱ',
        'ㄴ',
        'ㄷ',
        'ㄹ',
        'ㅁ',
        'ㅂ',
        'ㅅ',
        'ㅈ',
        'ㅊ',
        'ㅋ',
        'ㅌ',
        'ㅍ',
        'ㅎ',
      ].includes(name)
    ) {
      const where = this.buildTagWhere(name);

      return this.prisma.$queryRawUnsafe('SELECT * FROM tag t WHERE' + where);
    }
    return this.prisma.tag.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
  }

  createTag(createTagDto: CreateTagDto) {
    const { name } = createTagDto;
    return this.prisma.tag.upsert({
      create: {
        name,
      },
      update: {},
      where: {
        name,
      },
    });
  }

  private buildTagWhere(name: string) {
    let where;
    if (name == 'ㄱ') {
      where =
        " (t.name RLIKE '^(ㄱ|ㄲ)' OR ( t.name >= '가' AND t.name < '나' )) order by t.name";
    }
    if (name == 'ㄴ') {
      where =
        " (t.name RLIKE '^(ㄴ)' OR ( t.name >= '나' AND t.name < '다' )) order by t.name";
    }
    if (name == 'ㄷ') {
      where =
        " (t.name RLIKE '^(ㄷ|ㄸ)' OR ( t.name >= '다' AND t.name < '라' )) order by t.name";
    }
    if (name == 'ㄹ') {
      where =
        " (t.name RLIKE '^(ㄹ)' OR ( t.name >= '라' AND t.name < '마' )) order by t.name";
    }
    if (name == 'ㅁ') {
      where =
        " (t.name RLIKE '^(ㅁ)' OR ( t.name >= '마' AND t.name < '바' )) order by t.name";
    }
    if (name == 'ㅂ') {
      where =
        " (t.name RLIKE '^(ㅂ|ㅃ)' OR ( t.name >= '바' AND t.name < '사' )) order by t.name";
    }
    if (name == 'ㅅ') {
      where =
        " (t.name RLIKE '^(ㅅ|ㅆ)' OR ( t.name >= '사' AND t.name < '아' )) order by t.name";
    }
    if (name == 'ㅇ') {
      where =
        " (t.name RLIKE '^(ㅇ)' OR ( t.name >= '아' AND t.name < '자' )) order by t.name";
    }
    if (name == 'ㅈ') {
      where =
        " (t.name RLIKE '^(ㅈ|ㅉ)' OR ( t.name >= '자' AND t.name < '차' )) order by t.name";
    }
    if (name == 'ㅊ') {
      where =
        " (t.name RLIKE '^(ㅊ)' OR ( t.name >= '차' AND t.name < '카' )) order by t.name";
    }
    if (name == 'ㅋ') {
      where =
        " (t.name RLIKE '^(ㅋ)' OR ( t.name >= '카' AND t.name < '타' )) order by t.name";
    }
    if (name == 'ㅌ') {
      where =
        " (t.name RLIKE '^(ㅌ)' OR ( t.name >= '타' AND t.name < '파' )) order by t.name";
    }
    if (name == 'ㅍ') {
      where =
        " (t.name RLIKE '^(ㅍ)' OR ( t.name >= '파' AND t.name < '하' )) order by t.name";
    }
    if (name == 'ㅎ') {
      where = " (t.name RLIKE '^(ㅎ)' OR ( t.name >= '하' )) order by t.name";
    }

    return where;
  }
}
