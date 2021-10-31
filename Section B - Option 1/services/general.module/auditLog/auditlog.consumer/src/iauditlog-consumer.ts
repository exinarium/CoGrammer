import { AuditLogEvent } from '../../auditlog.dto/src/events/auditlog-event';
import { AuditLogResponse } from '../../auditlog.dto/src/responses/auditlog-response';
import { ObjectID } from 'mongodb';

export interface IAuditLogConsumer {
    consumeAsync(id: ObjectID, message: any): void;
    start(): void;
    requestStop(): void;
    stop(): void;
}
