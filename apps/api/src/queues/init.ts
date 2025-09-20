import { Queue } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379)
};

export const pdfQueue = new Queue('pdf-generation', { connection });

export function initQueues() {
  // In a full implementation we would process jobs here.
  // The queue is exported for worker processes.
}
