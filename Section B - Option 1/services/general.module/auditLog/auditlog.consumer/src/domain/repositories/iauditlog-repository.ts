import { AuditLogEvent } from '../../../../auditlog.dto/src';

export interface IAuditLogRepository {
    doAsync(event: AuditLogEvent<any>): Promise<boolean>;
}
