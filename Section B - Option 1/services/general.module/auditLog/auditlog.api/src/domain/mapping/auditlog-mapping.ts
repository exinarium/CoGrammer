import { IAuditLogMapping } from './iauditlog-mapping';
import { AuditLogRequest, AuditLogEvent } from '../../../../auditlog.dto/src';
import { ObjectID } from 'mongodb';

export class AuditLogMapping implements IAuditLogMapping {
    async mapToEvent(request: AuditLogRequest): Promise<AuditLogEvent<any>> {
        return new AuditLogEvent(
            new ObjectID(request.objectid),
            new Date(),
            request.eventName,
            request.data,
            request.version,
            request.module
        );
    }
}
