import express from 'express';
import { ActiveCampaignIntegrationController } from './controllers/activecampaignintegration-controller.js';
import { ActiveCampaignIntegrationAggregate } from './domain/aggregates/activecampaignintegration-aggregate';
import Configuration from './configuration.json';
import { ActiveCampaignIntegrationMapping } from './domain/mapping/activecampaignintegration-mapping';
import { ActiveCampaignIntegrationValidation } from './domain/validation/activecampaignintegration-validation';
import MetricsLogger from 'covidscreener-metricslogger';
import { validateJWT } from 'covidscreener-authentication-jwt';
import { ActiveCampaignIntegrationRepository } from './domain/repositories/acitvecampaignintegration-repository.js';
import { DBConfig } from './domain/config/db-config.js';
import { Config } from './domain/config/config.js';
import { ActiveCampaignIntegrationRequest } from '../../activecampaignintegration.dto/src/index.js';

const app = express();
const metricslogger = new MetricsLogger(Configuration, true);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req: any, res: any, next: any) => {
    metricslogger.apiMetrics(
        res,
        req,
        () => {
            validateJWT(req, res, next, Configuration.roles);
        },
        Configuration
    );
});

const port = 8002; // default port to listen

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType: any) => {
    process.on(eventType, () => {
        server.close(() => {
            // tslint:disable-next-line:no-console
            console.log('\n\nStop signal received');
            process.exit(0);
        });
    });
});

const databaseConfig = new DBConfig(
    Configuration.databaseConfig.databaseName,
    Configuration.databaseConfig.collectionName,
    Configuration.databaseConfig.connectionString
);

const config = new Config(databaseConfig);

const mapper = new ActiveCampaignIntegrationMapping();
const validation = new ActiveCampaignIntegrationValidation();
const repository = new ActiveCampaignIntegrationRepository(config);
const aggregate = new ActiveCampaignIntegrationAggregate(validation, mapper, repository);

// define a route handler for the default home page
app.post('/api/v1/activecampaignintegration', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    const controller = new ActiveCampaignIntegrationController(aggregate);
    const result = await controller.storeTokenAsync(request, user);

    res.status(result.code).send(result);
});

app.post('/api/v1/activecampaignintegration/find-lists', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    const controller = new ActiveCampaignIntegrationController(aggregate);
    const result = await controller.retrieveAvailableLists(request, user);

    res.status(result.code).send(result);
});

// start the Express server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
