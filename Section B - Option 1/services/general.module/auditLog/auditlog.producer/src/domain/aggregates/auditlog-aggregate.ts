import { IAuditLogAggregate } from './iauditlog-aggregate';
import { AuditLogResponse, AuditLogEvent, ResponseStatus } from '../../../dist/auditlog.dto/src';
import { IAuditLogMessageBus } from '../messageBus/iauditlog-message-bus';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class AuditLogAggregate implements IAuditLogAggregate {
    constructor(private messageBus: IAuditLogMessageBus) { }

    async doAsync(event: AuditLogEvent<any>): Promise<AuditLogResponse> {
        try {
            const result = await this.messageBus.produceMessage(event);

            if (result) {
                const response = new AuditLogResponse(
                    event?.objectId?.toHexString(),
                    'Event produced successfully',
                    ResponseStatus.success,
                    200,
                    {}
                );
                return response;
            } else {

                throw new Error("Producing message failed in MessageBus");
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in AuditLog producer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
