import { GoogleSheetIntegrationRequest, GoogleSheetIntegrationResponse, ResponseStatus, StatusCode } from '../../../googlesheetintegration.dto/src';
import { GoogleSheetIntegrationAggregate } from '../domain/aggregates/googlesheetintegration-aggregate';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class GoogleSheetIntegrationController {
    constructor(private _aggregate: GoogleSheetIntegrationAggregate) { }

    async doAsync(request: GoogleSheetIntegrationRequest, user: any): Promise<GoogleSheetIntegrationResponse> {
        try {
            if (user.isAdminUser) {
                const response = await this._aggregate.doAsync(request, user);
                return response;
            } else {
                return {
                    id: request.id,
                    message: 'You do not have access to link Google sheets for this account',
                    status: ResponseStatus.failure,
                    code: StatusCode.forbidden,
                    data: {},
                }
            }
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing aggregation logic in GoogleSheetIntegration API: Request Id: ${request.id}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return new GoogleSheetIntegrationResponse(
                request.id,
                'An error occurred inside the GoogleSheetIntegration controller and the request could not be processed',
                ResponseStatus.failure,
                500,
                {}
            );
        }
    }
}
