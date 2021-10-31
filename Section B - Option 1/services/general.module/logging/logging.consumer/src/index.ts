import { LoggingConsumer } from './logging-consumer';

const consumer = new LoggingConsumer();

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType: any) => {
    process.on(eventType, () => {
        // tslint:disable-next-line:no-console
        console.log(`Stopping process: ${eventType}`);
        consumer.requestStop();
    });
});

consumer.start();
