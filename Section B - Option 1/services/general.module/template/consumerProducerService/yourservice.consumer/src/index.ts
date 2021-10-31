import { YourServiceConsumer } from './yourservice-consumer';

const consumer = new YourServiceConsumer();

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType: any) => {
    process.on(eventType, () => consumer.requestStop());
});

consumer.start();
