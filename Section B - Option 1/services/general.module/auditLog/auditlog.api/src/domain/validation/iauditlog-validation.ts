import { AuditLogRequest, AuditLogResponse } from '../../../../auditlog.dto/src';

export interface IAuditLogValidation {
    validate(request: AuditLogRequest): Promise<AuditLogResponse>;
}
