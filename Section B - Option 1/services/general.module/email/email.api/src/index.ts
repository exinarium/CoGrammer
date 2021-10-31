import express from 'express';
import { EmailController } from './controllers/email-controller.js';
import { EmailAggregate } from './domain/aggregates/email-aggregate';
import Configuration from './configuration.json';
import { EmailMapping } from './domain/mapping/email-mapping';
import { EmailValidation } from './domain/validation/email-validation';
import MetricsLogger from 'covidscreener-metricslogger';
import { validateJWT } from 'covidscreener-authentication-jwt';
import { Config } from './domain/config/config.js';

const app = express();
const metricslogger = new MetricsLogger(Configuration, true);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req: any, res: any, next: any) => {
    metricslogger.apiMetrics(
        res,
        req,
        () => {
            next();
        },
        Configuration
    );
});

const port = 8080; // default port to listen

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType: any) => {
    process.on(eventType, () => {
        server.close(() => {
            // tslint:disable-next-line:no-console
            console.log('\n\nStop signal received');
            process.exit(0);
        });
    });
});


const config = new Config(Configuration.recaptchaSecret, Configuration.googleVerifyUrl, Configuration.supportEmail);
const validation = new EmailValidation(config);
const mapper = new EmailMapping(config);
const aggregate = new EmailAggregate(validation, mapper);

// define a route handler for the default home page
app.post('/api/v1/email', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    const controller = new EmailController(aggregate);
    const result = await controller.doAsync(request);

    res.status(result.code).send(result);
});

// start the Express server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
