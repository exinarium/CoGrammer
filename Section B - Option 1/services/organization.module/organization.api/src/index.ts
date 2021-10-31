import express, { json } from 'express';
import { OrganizationController } from './controllers/organization-controller.js';
import { OrganizationAggregate } from './domain/aggregates/organization-aggregate';
import { OrganizationRepository } from './domain/repositories/organization-repository';
import { Config } from './domain/config/config';
import Configuration from './configuration.json';
import { DBConfig } from './domain/config/db-config';
import { OrganizationMapping } from './domain/mapping/organization-mapping';
import { OrganizationValidation } from './domain/validation/organization-validation';
import MetricsLogger from 'covidscreener-metricslogger';
import { validateJWT } from 'covidscreener-authentication-jwt';
import { ObjectID } from 'mongodb';
import { StatusCode } from './domain/enums/status-code.js';
import { ResponseStatus } from './domain/enums/response-status.js';
import { createHmac } from 'crypto';

const app = express();
const metricslogger = new MetricsLogger(Configuration, true);
app.use(express.urlencoded({ extended: true }));
app.use(express.json({
    verify: (req, res, buf) => {
        // @ts-ignore
        req.rawBody = buf;
    }
}));

app.use((req: any, res: any, next: any) => {
    metricslogger.apiMetrics(
        res,
        req,
        () => {
            if (req.url === '/api/v1/createorganization') {
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

const config = new Config(databaseConfig);
const repository = new OrganizationRepository(config);
const mapper = new OrganizationMapping();
const validation = new OrganizationValidation();
const aggregate = new OrganizationAggregate(repository, validation, mapper);

app.post('/api/v1/createorganization', async (req, res) => {

    const source = req.header('X-Webhook-Source');
    const signature = req.header('X-Webhook-Signature');
    const topic = req.header('X-Webhook-Topic');
    const request = req.body;
    request.requestId = req.header('X-Webhook-Id');

    const key = Configuration.webhookSettings.webhookSecret;

    const hmac = createHmac('sha512', key);
    // @ts-ignore
    const content = req.rawBody;
    hmac.update(content);
    const value = hmac.digest('hex');

    if (!topic || topic !== 'contact_updated') {

        res.status(400).send('Invalid topic');
    }

    if (!source || source !== Configuration.webhookSettings.sourceURL) {

        res.status(400).send('Invalid source');
    }

    if (!signature || signature !== value) {

        res.status(401).send('Authentication failed');
    }

    if (request.requestId && request.requestId !== '') {
        const controller = new OrganizationController(aggregate);
        const result = await controller.createAsync(request);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The organization requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.put('/api/v1/updateorganization', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    if (request.requestId && request.requestId !== '') {
        const controller = new OrganizationController(aggregate);
        const result = await controller.updateAsync(request, user);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The organization requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.delete('/api/v1/deleteorganization/:requestId/:organizationId', async (req, res) => {
    const user = res.locals.user;
    const organizationId = req.param('organizationId');
    const requestId = req.param('requestId');

    if (requestId && requestId !== '') {
        const controller = new OrganizationController(aggregate);
        const result = await controller.deleteAsync(requestId, organizationId, user);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The organization requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.delete('/api/v1/undeleteorganization/:requestId/:organizationId', async (req, res) => {
    const user = res.locals.user;
    const organizationId = req.param('organizationId');
    const requestId = req.param('requestId');

    if (requestId && requestId !== '') {
        const controller = new OrganizationController(aggregate);
        const result = await controller.undeleteAsync(requestId, organizationId, user);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The organization requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.get('/api/v1/organizationlookup/:requestId/:id?', async (req, res) => {
    const user = res.locals.user;
    const id = req.param('id');
    const requestId = req.param('requestId');

    if (requestId && requestId !== '') {
        if (id && id !== '') {
            const controller = new OrganizationController(aggregate);
            const result = await controller.lookupAsync(id, user, requestId);

            res.status(result.code).send(result);
        } else {
            res.status(StatusCode.badRequest).send({
                responseId: new ObjectID(),
                message: 'The organization id parameter cannot be empty',
                status: ResponseStatus.failure,
            });
        }
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The organization requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

// start the Express server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
