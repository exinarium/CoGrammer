import { ExcelIntegrationResponse } from '../../../../excelintegration.dto/src/responses/excelintegration-response';
import { ResponseStatus } from '../../../../excelintegration.dto/src/responses/response-status';
import { ExcelIntegrationEvent } from '../../../../excelintegration.dto/src';
import { ExcelIntegrationDataModel } from '../../domain/models/excelintegration-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ObjectId } from 'mongodb';

export class ExcelIntegrationValidation {
    async validate(event: ExcelIntegrationEvent<ExcelIntegrationDataModel>): Promise<ExcelIntegrationResponse> {
        try {
            let valid = true;
            let returnMessage = '';

            let response: ExcelIntegrationResponse;
            if (!event) {
                return new ExcelIntegrationResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
            } else {
                if(!event?.id || !ObjectId.isValid(event.id)) {
                    valid = false;
                    returnMessage += 'You need to provide a valid event ID';
                }

                if(!event?.eventName || event.eventName === '') {
                    valid = false;
                    returnMessage += 'You need to provide a valid event name';
                }

                if(!event?.producedAt) {
                    valid = false;
                    returnMessage += 'You need to provide a valid event produced date';
                }

                if(!event?.version || event.version <= 0) {
                    valid = false;
                    returnMessage += 'You need to provide a valid event version';
                }

                if(!event?.data) {
                    valid = false;
                    returnMessage += 'You need to provide a some data as part of your event';
                }

                if(!event?.data?.emailAddress || event?.data?.emailAddress === '') {
                    valid = false;
                    returnMessage += 'You need to provide a valid email address to send the data to';
                }

                if(!event?.data?.exportType || event?.data?.exportType <= 0 || event?.data?.exportType > 3) {
                    valid = false;
                    returnMessage += 'You need to provide a valid export type for your data';
                }
            }

            if (!valid) {
                response = new ExcelIntegrationResponse(
                    event?.id?.toHexString(),
                    returnMessage,
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }

            response = new ExcelIntegrationResponse(
                event?.id?.toHexString(),
                'Event data is valid',
                ResponseStatus.success,
                200,
                {}
            );

            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error during request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
