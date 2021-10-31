import { YourServiceRequest, YourServiceResponse, ResponseStatus } from '../../../../yourservice.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class YourServiceValidation {
    async validate(request: YourServiceRequest): Promise<YourServiceResponse> {
        try {
            const valid = true;
            const returnMessage = '';

            if (!request) {
                return new YourServiceResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
            } else {
                /**
                 * Add your validation here
                 */
            }

            if (!valid) {
                return new YourServiceResponse(request.id, returnMessage, ResponseStatus.failure, 400, {});
            }

            const response = new YourServiceResponse(request.id, returnMessage, ResponseStatus.success, 200, {});
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error during request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
