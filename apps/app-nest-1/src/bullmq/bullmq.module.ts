import { Module } from '@nestjs/common';
import { BullmqController } from './bullmq.controller';
import { BullmqService } from './bullmq.service';
import { BullModule } from '@nestjs/bullmq';
import { MY_TASK_QUEUE_NAME } from './bullmq.constants';
import { MyTaskQueueConsumer } from './my-task-queue.consumer';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => {
        const mandatoryCredentials = [
          process.env['REDIS_HOST'],
          process.env['REDIS_PORT'],
        ];

        if (mandatoryCredentials.some((cred) => !cred)) {
          throw new Error('Missing mandatory Redis credentials');
        }

        const [host, portString] = mandatoryCredentials as [string, string];
        const password = process.env['REDIS_PASSWORD'];

        if (portString.match(/\D/)) {
          throw new Error('Invalid Redis port');
        }
        const port = parseInt(portString);

        return {
          connection: {
            host,
            port,
            ...(password && { password }),
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: MY_TASK_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
  ],
  controllers: [BullmqController],
  providers: [BullmqService, MyTaskQueueConsumer],
})
export class BullmqModule {}
