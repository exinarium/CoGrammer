import { GoogleSheetIntegrationConsumer } from './googlesheetintegration-consumer';

const consumer = new GoogleSheetIntegrationConsumer();

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType: any) => {
    process.on(eventType, () => consumer.requestStop());
});

consumer.start();
