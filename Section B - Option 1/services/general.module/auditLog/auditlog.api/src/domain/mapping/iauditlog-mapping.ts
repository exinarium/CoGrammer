import { AuditLogRequest, AuditLogEvent } from '../../../../auditlog.dto/src';

export interface IAuditLogMapping {
    mapToEvent(request: AuditLogRequest): Promise<AuditLogEvent<any>>;
}
