import { AuditLogEvent, AuditLogResponse } from '../../../dist/auditlog.dto/src';

export interface IAuditLogAggregate {
    doAsync(data: AuditLogEvent<any>): Promise<AuditLogResponse>;
}
