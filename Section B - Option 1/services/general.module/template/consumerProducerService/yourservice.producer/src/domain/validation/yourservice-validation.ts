import { YourServiceResponse } from '../../../../yourservice.dto/src/responses/yourservice-response';
import { ResponseStatus } from '../../../../yourservice.dto/src/responses/response-status';
import { YourServiceEvent } from '../../../../yourservice.dto/src';
import { YourServiceDataModel } from '../../domain/models/yourservice-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class YourServiceValidation {
    async validate(event: YourServiceEvent<YourServiceDataModel>): Promise<YourServiceResponse> {
        try {
            const valid = true;
            const returnMessage = '';

            let response: YourServiceResponse;
            if (!event) {
                return new YourServiceResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
            } else {
                /**
                 * Add your validation here
                 */
            }

            if (!valid) {
                response = new YourServiceResponse(
                    event?.id?.toHexString(),
                    returnMessage,
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }

            response = new YourServiceResponse(
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
