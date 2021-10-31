import { AuditLogEvent } from '../../../dist/auditlog.dto/src';

export interface IAuditLogMessageBus {
    produceMessage(message: AuditLogEvent<any>): Promise<boolean>;
}
