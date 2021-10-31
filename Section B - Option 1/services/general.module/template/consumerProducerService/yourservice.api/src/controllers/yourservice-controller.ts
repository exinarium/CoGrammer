import { YourServiceRequest, YourServiceResponse, ResponseStatus } from '../../../yourservice.dto/src';
import { YourServiceAggregate } from '../domain/aggregates/yourservice-aggregate';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class YourServiceController {
    constructor(private _aggregate: YourServiceAggregate) {}

    async doAsync(request: YourServiceRequest): Promise<YourServiceResponse> {
        try {
            const response = await this._aggregate.doAsync(request);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing aggregation logic in YourService API: Request Id: ${request.id}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return new YourServiceResponse(
                request.id,
                'An error occurred inside the YourService controller and the request could not be processed',
                ResponseStatus.failure,
                500,
                {}
            );
        }
    }
}
