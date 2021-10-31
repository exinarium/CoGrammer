import { AuditLogResponse, AuditLogRequest } from '../../../../auditlog.dto';

export interface IAuditLogAggregate {
    doAsync(data: AuditLogRequest): Promise<AuditLogResponse>;
}
