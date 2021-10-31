import { ResponseStatus } from './reponse-status';
import client, { Registry } from 'prom-client';

export interface IPrometheus {
    register: Registry;
    gateway: client.Pushgateway;
    applicationName: string;
}
