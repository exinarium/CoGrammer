import { IPrometheus } from './iprometheus';
import client, { Registry, Gauge, Counter } from 'prom-client';
import { ResponseStatus } from './reponse-status';

export class Prometheus implements IPrometheus {
    register: Registry;
    gateway: client.Pushgateway;
    applicationName: string;

    constructor(config: any) {
        this.register = client.register;
        this.gateway = new client.Pushgateway(config.apiMetrics.serverAddress);

        client.collectDefaultMetrics();
        this.applicationName = config.apiMetrics.applicationName;
    }
}
