import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { MY_TASK_NAME, MY_TASK_QUEUE_NAME } from './bullmq.constants';
import { MyTaskDataType } from './my-task-data-type.interface';
import { MyTaskReturnType } from './my-task-return-type.type';
import { MyTaskNameType } from './my-task-name-type.type';

@Injectable()
export class BullmqService {
  constructor(
    @InjectQueue(MY_TASK_QUEUE_NAME)
    private myTaskQueue: Queue<
      MyTaskDataType,
      MyTaskReturnType,
      MyTaskNameType
    >,
  ) {}

  async getAll() {
    const jobs = await this.myTaskQueue.getJobs();

    return jobs;
  }

  async add(): Promise<void> {
    const job = await this.myTaskQueue.add(
      MY_TASK_NAME,
      {
        foo: 'bar',
      },
      {
        delay: 10000,
      },
    );

    console.log('Job added:', job.id);
  }

  remove(jobId: string) {
    return this.myTaskQueue.remove(jobId);
  }
}
