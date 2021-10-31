import express from 'express';
import { YourServiceController } from './controllers/yourservice-controller.js';
import { YourServiceAggregate } from './domain/aggregates/yourservice-aggregate';
import Configuration from './configuration.json';
import { YourServiceMapping } from './domain/mapping/yourservice-mapping';
import { YourServiceValidation } from './domain/validation/yourservice-validation';
import MetricsLogger from 'covidscreener-metricslogger';
import { validateJWT } from 'covidscreener-authentication-jwt';

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

const port = 8080; // default port to listen

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType: any) => {
    process.on(eventType, () => {
        server.close(() => {
            // tslint:disable-next-line:no-console
            console.log('\n\nStop signal received');
            process.exit(0);
        });
    });
});

const mapper = new YourServiceMapping();
const validation = new YourServiceValidation();
const aggregate = new YourServiceAggregate(validation, mapper);

// define a route handler for the default home page
app.post('/api/v1/yourservice', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    const controller = new YourServiceController(aggregate);
    const result = await controller.doAsync(request);

    res.status(result.code).send(result);
});

// start the Express server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
