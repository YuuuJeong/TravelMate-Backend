import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { CreateTagDto } from './dtos/create-tag.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';

@Controller('tags')
@ApiTags('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  async findAll() {
    return await this.tagService.findAllTags();
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get tag by name' })
  getTagByName(name: string) {
    return this.tagService.getTagByName(name);
  }

  @Get('search/:name')
  @ApiOperation({ summary: 'Search tags by name' })
  searchTagsByName(@Param('name') name: string) {
    return this.tagService.searchTagsByName(name);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createTagDto: CreateTagDto) {
    return await this.tagService.createTag(createTagDto);
  }
}
