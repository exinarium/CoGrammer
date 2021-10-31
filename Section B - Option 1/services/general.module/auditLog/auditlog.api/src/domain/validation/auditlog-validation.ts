import { IAuditLogValidation } from './iauditlog-validation';
import { AuditLogRequest, AuditLogResponse, ResponseStatus } from '../../../../auditlog.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class AuditLogValidation implements IAuditLogValidation {
    async validate(request: AuditLogRequest): Promise<AuditLogResponse> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!request) {
                return new AuditLogResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
            } else {
                if (request.objectid === undefined || request.objectid === '') {
                    valid = false;
                    returnMessage += '\nRequest objectid property cannot be null';
                }

                if (request.eventName === undefined || request.eventName === '') {
                    valid = false;
                    returnMessage += '\nRequest eventName property cannot be null';
                }

                if (request.data === undefined || request.data === '') {
                    valid = false;
                    returnMessage += '\nRequest data property cannot be null';
                }

                if (request.version === undefined || request.version <= 0) {
                    valid = false;
                    returnMessage += '\nRequest version property cannot be less or equal than 0';
                }

                if (request.module === undefined || request.module < 0) {
                    valid = false;
                    returnMessage += '\nRequest module cannot be less or equal to 0';
                }
            }

            if (!valid) {
                return new AuditLogResponse(request.id, returnMessage, ResponseStatus.failure, 400, {});
            }

            const response = new AuditLogResponse(request.id, returnMessage, ResponseStatus.success, 200, {});
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error during request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
