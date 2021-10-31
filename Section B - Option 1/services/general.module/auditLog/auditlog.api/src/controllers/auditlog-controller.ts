import { AuditLogRequest, AuditLogResponse, ResponseStatus } from '../../../auditlog.dto/src';
import { AuditLogAggregate } from '../domain/aggregates/auditlog-aggregate';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class AuditLogController {
    constructor(private _aggregate: AuditLogAggregate) {}

    async doAsync(request: AuditLogRequest): Promise<AuditLogResponse> {
        try {
            const response = await this._aggregate.doAsync(request);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing aggregation logic in AuditLog API: Request Id: ${request.id}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return new AuditLogResponse(
                request.id,
                'An error occurred inside the AuditLog controller and the request could not be processed',
                ResponseStatus.failure,
                500,
                {}
            );
        }
    }
}
