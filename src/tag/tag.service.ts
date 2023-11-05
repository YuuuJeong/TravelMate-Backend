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
    return this.prisma.tag.create({
      data: {
        name,
      },
    });
  }
}
