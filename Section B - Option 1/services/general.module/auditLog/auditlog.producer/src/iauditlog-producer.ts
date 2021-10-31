import { AuditLogEvent } from '../dist/auditlog.dto/src/events/auditlog-event';
import { AuditLogResponse } from '../dist/auditlog.dto/src/responses/auditlog-response';

export interface IAuditLogProducer {
    produceAsync(event: AuditLogEvent<any>): Promise<AuditLogResponse>;
}
