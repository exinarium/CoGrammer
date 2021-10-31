import { IAuditLogAggregate } from './iauditlog-aggregate';
import { IAuditLogRepository } from '../repositories/iauditlog-repository';
import { AuditLogResponse, ResponseStatus, AuditLogEvent } from '../../../../auditlog.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ObjectID } from 'mongodb';

export class AuditLogAggregate implements IAuditLogAggregate {
    constructor(private repository: IAuditLogRepository) {}

    async doAsync(message: AuditLogEvent<any>): Promise<AuditLogResponse> {
        try {
            if (message) {
                const result = await this.repository.doAsync(message);

                if (result) {

                    message.objectId = new ObjectID(message.objectId)

                    const response = new AuditLogResponse(
                        message?.objectId?.toHexString(),
                        'AuditLog request success',
                        ResponseStatus.success,
                        200,
                        { result }
                    );

                    return response;
                } else {
                    const response = new AuditLogResponse(
                        message?.objectId?.toHexString(),
                        'AuditLog request failure',
                        ResponseStatus.failure,
                        500,
                        { result }
                    );

                    return response;
                }
            } else {
                const ERROR_MESSAGE = 'Message data is invalid';
                await LoggingProducer.logAsync(ERROR_MESSAGE, undefined, LogPriority.high);

                const response = new AuditLogResponse(
                    message?.objectId?.toHexString(),
                    ERROR_MESSAGE,
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in AuditLog producer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
