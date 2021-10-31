import { IAuditLogMessageBus } from './iauditlog-message-bus';
import { AuditLogEvent } from '../../../dist/auditlog.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import MessageBus from 'covidscreener-messagebus';

export class AuditLogMessageBus implements IAuditLogMessageBus {
    constructor(private connectionString: string, private topic: string) { }

    async produceMessage(message: AuditLogEvent<any>): Promise<boolean> {
        try {
            const messageBus = new MessageBus(this.connectionString);
            const result = await messageBus.send(this.topic, message);
            return result;
        } catch (ex) {
            const ERROR_MESSAGE = `An error occurred while producing a message in the audit log producer: ${ex}`;
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
