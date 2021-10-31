import { IAuditLogProducer } from './iauditlog-producer';
import { AuditLogEvent } from '../dist/auditlog.dto/src/events/auditlog-event';
import { AuditLogResponse } from '../dist/auditlog.dto/src/responses/auditlog-response';
import { AuditLogAggregate } from './domain/aggregates/auditlog-aggregate';
import Configuration from './configuration.json';
import { AuditLogMessageBus } from './domain/messageBus/auditlog-message-bus';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class AuditLogProducer implements IAuditLogProducer {
    private aggregate: AuditLogAggregate;

    constructor() {

        const messageBus = new AuditLogMessageBus(Configuration.databaseConfig.connectionString, Configuration.databaseConfig.topic);
        this.aggregate = new AuditLogAggregate(messageBus);
    }

    async produceAsync(event: AuditLogEvent<any>): Promise<AuditLogResponse> {
        try {
            const response = await this.aggregate.doAsync(event);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while trying to produce a message for AuditLog';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
