import { LOG4 } from '@/util';
import * as Queue from 'bull';
const queue = new Queue('huang', 'redis://127.0.0.1:6379');
queue.on('global:progress', (jobId, progress) => {
  LOG4.http.info(`Job ${jobId} is ${progress * 100}% ready!`);
});
queue.on('global:completed', jobId => {
  LOG4.http.info(`Job with id ${jobId} has been completed`);
});

const main = async () => {
  for (let i = 0; i < 10; i++) {
    const job = await queue.add(
      {
        key: Math.random()
      },
      {
        delay: 5000
      }
    );
    LOG4.http.info('生产者:', job.data, await queue.count());
  }
};
main();

export * as huangfu from '@/util/log4js';
