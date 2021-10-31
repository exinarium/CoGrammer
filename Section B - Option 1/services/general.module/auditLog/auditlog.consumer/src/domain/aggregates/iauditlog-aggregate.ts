import { AuditLogResponse, AuditLogEvent } from '../../../../auditlog.dto/src';

export interface IAuditLogAggregate {
    doAsync(data: AuditLogEvent<any>): Promise<AuditLogResponse>;
}
