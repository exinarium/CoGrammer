import { ExcelIntegrationRequest, ExcelIntegrationResponse, ResponseStatus } from '../../../excelintegration.dto/src';
import { ExcelIntegrationAggregate } from '../domain/aggregates/excelintegration-aggregate';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { Stream } from 'stream';

export class ExcelIntegrationController {
    constructor(private _aggregate: ExcelIntegrationAggregate) {}

    async doAsync(request: ExcelIntegrationRequest, user: any): Promise<ExcelIntegrationResponse> {
        try {
            const response = await this._aggregate.doAsync(request, user);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing aggregation logic in ExcelIntegration API: Request Id: ${request.id}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return new ExcelIntegrationResponse(
                request.id,
                'An error occurred inside the ExcelIntegration controller and the request could not be processed',
                ResponseStatus.failure,
                500,
                {}
            );
        }
    }
}
