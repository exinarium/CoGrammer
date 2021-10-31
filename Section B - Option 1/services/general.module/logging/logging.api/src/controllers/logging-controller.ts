import { LoggingRequest, LoggingResponse, ResponseStatus } from '../../../logging.dto/src';
import { LoggingAggregate } from '../domain/aggregates/logging-aggregate';

export class LoggingController {
    private _aggregate: LoggingAggregate;

    constructor(aggregate: LoggingAggregate) {
        this._aggregate = aggregate;
    }

    async logAsync(request: LoggingRequest): Promise<LoggingResponse> {
        try {
            const response = await this._aggregate.logAsync(request);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while logging the error: ${ex}`;
            // tslint:disable-next-line:no-console
            console.log(ERROR_MESSAGE);

            return new LoggingResponse(
                request.id,
                'An error occurred in while Logging through the API',
                ResponseStatus.failure,
                500,
                {}
            );
        }
    }
}
