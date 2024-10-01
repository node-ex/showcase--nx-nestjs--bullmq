import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BullmqService } from './bullmq.service';

@Controller('bullmq')
export class BullmqController {
  constructor(private readonly bullmqService: BullmqService) {}

  @Get()
  async getData() {
    const jobs = await this.bullmqService.getAll();

    return {
      jobs,
    };
  }

  @Post()
  async addData(): Promise<void> {
    await this.bullmqService.add();
  }

  @Delete(':jobId')
  async removeData(@Param('jobId') jobId: string): Promise<void> {
    await this.bullmqService.remove(jobId);
  }
}
