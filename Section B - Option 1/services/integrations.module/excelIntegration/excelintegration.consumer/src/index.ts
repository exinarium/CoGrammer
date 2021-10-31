import { ExcelIntegrationConsumer } from './excelintegration-consumer';

const consumer = new ExcelIntegrationConsumer();

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType: any) => {
    process.on(eventType, () => consumer.requestStop());
});

consumer.start();
