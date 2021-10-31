import express from 'express';
import { PayfastController } from './controllers/payfast-controller.js';
import { PayfastAggregate } from './domain/aggregates/payfast-aggregate';
import { PayfastRepository } from './domain/repositories/payfast-repository';
import { Config } from './domain/config/config';
import ConfigurationProd from './configuration.json';
import ConfigurationDev from './configuration.development.json';
import { DBConfig } from './domain/config/db-config';
import { PayfastMapping } from './domain/mapping/payfast-mapping';
import { PayfastValidation } from './domain/validation/payfast-validation';
import MetricsLogger from 'covidscreener-metricslogger';
import { validateJWT } from 'covidscreener-authentication-jwt';
import { ObjectID } from 'mongodb';
import { StatusCode } from './domain/enums/status-code.js';
import { ResponseStatus } from './domain/enums/response-status.js';
import { PayfastConfig } from './domain/config/payfast-config.js';
import axios from 'axios';

let Configuration: any;

if(process?.env?.environment === 'development') {
    Configuration = ConfigurationDev;
} else {
    Configuration = ConfigurationProd;
}

const app = express();
const metricslogger = new MetricsLogger(Configuration, true);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req: any, res: any, next: any) => {

    metricslogger.apiMetrics(
        res,
        req,
        () => {
            if (req.url === '/api/v1/payfast-itn/') {
                next();
            } else {
                validateJWT(req, res, next, Configuration.roles);
            }
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

// Define services
const databaseConfig = new DBConfig(
    Configuration.databaseConfig.databaseName,
    Configuration.databaseConfig.collectionName,
    Configuration.databaseConfig.connectionString
);

const payfastConfig = new PayfastConfig(
    Configuration.payfastConfig.url,
    Configuration.payfastConfig.merchantId,
    Configuration.payfastConfig.merchantKey,
    Configuration.payfastConfig.passphrase,
    Configuration.payfastConfig.payfastMainUrl
);

const config = new Config(databaseConfig, payfastConfig);
const repository = new PayfastRepository(config);
const mapper = new PayfastMapping();
const validation = new PayfastValidation();
const aggregate = new PayfastAggregate(repository, validation, mapper);

// define a route handler for the default home page
app.post('/api/v1/cancelpayfast', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    if (request.requestId && request.requestId !== '') {
        const controller = new PayfastController(aggregate);
        const result = await controller.cancelAsync(request, user);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The payfast requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.put('/api/v1/updatepayfast', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    if (request.requestId && request.requestId !== '') {
        const controller = new PayfastController(aggregate);
        const result = await controller.updateAsync(request, user);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The payfast requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.post('/api/v1/payfast-itn', async (req, res) => {
    const request = req.body;

    if (req.headers.referer !== 'https://www.payfast.co.za' &&
        req.headers.referer !== 'https://w1w.payfast.co.za' &&
        req.headers.referer !== 'https://w2w.payfast.co.za' &&
        req.headers.referer !== 'https://sandbox.payfast.co.za') {

        res.status(400).send({ message: 'Invalid host' });
    }

    const valid = await axios.post(`${config.payfastConfig.payfastMainUrl}/query/validate`, `m_payment_id=${request.m_payment_id}&pf_payment_id=${request.pf_payment_id}`);

    if (valid.data === 'INVALID') {

        res.status(400).send({ message: 'Transaction Invalid' });
    }

    const controller = new PayfastController(aggregate);
    const result = await controller.payfastNotificationAsync(request);

    if (result.status === ResponseStatus.failure) {
        res.status(500).send({message: result.message});
    } else {
        res.status(200).send();
    }
});

// start the Express server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
    // tslint:disable-next-line:no-console
    console.log(`environment: ${process?.env?.environment}`);
});
