import { IAuditLogAggregate } from './iauditlog-aggregate';
import { AuditLogResponse, ResponseStatus, AuditLogRequest } from '../../../../auditlog.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { IAuditLogValidation } from '../validation/iauditlog-validation';
import { IAuditLogMapping } from '../mapping/iauditlog-mapping';
import { AuditLogProducer } from 'covidscreener-auditlog/dist';

export class AuditLogAggregate implements IAuditLogAggregate {
    constructor(private validation: IAuditLogValidation, private mapper: IAuditLogMapping) { }

    async doAsync(request: AuditLogRequest): Promise<AuditLogResponse> {
        try {
            const validationResponse = await this.validation.validate(request);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.id = request.id;
                return validationResponse;
            }

            const event = await this.mapper.mapToEvent(request);
            const resultEvent = await new AuditLogProducer().produceAsync(event);

            if (resultEvent) {
                const response = new AuditLogResponse(
                    request.id,
                    'AuditLog request success',
                    ResponseStatus.success,
                    200,
                    { resultEvent }
                );

                return response;
            } else {
                const response = new AuditLogResponse(
                    request.id,
                    'AuditLog request failure',
                    ResponseStatus.failure,
                    500,
                    { resultEvent }
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in AuditLog API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
