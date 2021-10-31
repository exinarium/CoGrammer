import { HubspotIntegrationConsumer } from './hubspotintegration-consumer';

const consumer = new HubspotIntegrationConsumer();

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType: any) => {
    process.on(eventType, () => consumer.requestStop());
});

consumer.start();
