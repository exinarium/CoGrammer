import { ActiveCampaignIntegrationConsumer } from './activecampaignintegration-consumer';

const consumer = new ActiveCampaignIntegrationConsumer();

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType: any) => {
    process.on(eventType, () => consumer.requestStop());
});

consumer.start();
