import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MY_TASK_NAME, MY_TASK_QUEUE_NAME } from './bullmq.constants';
import { MyTaskDataType } from './my-task-data-type.interface';
import { MyTaskReturnType } from './my-task-return-type.type';
import { MyTaskNameType } from './my-task-name-type.type';
import { Job } from 'bullmq';

@Processor(MY_TASK_QUEUE_NAME)
export class MyTaskQueueConsumer extends WorkerHost {
  async process(
    job: Job<MyTaskDataType, MyTaskReturnType, MyTaskNameType>,
  ): Promise<MyTaskReturnType> {
    switch (job.name) {
      case MY_TASK_NAME:
        console.log('Processing job', job);
        break;
      default: {
        throw new Error('Invalid job name');
      }
    }

    return Promise.resolve(undefined);
  }
}
