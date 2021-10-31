import express from 'express';
import { LoggingController } from './controllers/logging-controller.js';
import { LoggingAggregate } from './domain/aggregates/logging-aggregate';
import Configuration from './configuration.json';
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

const port = 8020; // default port to listen

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType: any) => {
    process.on(eventType, () => {
        server.close(() => {
            // tslint:disable-next-line:no-console
            console.log('\n\nStop signal received');
            process.exit(0);
        });
    });
});

// Define services
const aggregate = new LoggingAggregate();

// define a route handler for the default home page
app.post('/api/v1/log', async (req, res) => {
    const request = req.body;

    const controller = new LoggingController(aggregate);
    const result = await controller.logAsync(request);

    res.status(result.code).send(result);
});

// start the Express server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
