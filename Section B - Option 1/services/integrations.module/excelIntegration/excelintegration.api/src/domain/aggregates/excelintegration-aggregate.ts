import { ExcelIntegrationResponse, ResponseStatus, ExcelIntegrationRequest } from '../../../../excelintegration.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ExcelIntegrationProducer } from 'covidscreener-excelintegration/dist/excelintegration.producer/src';
import { ExcelIntegrationValidation } from '../validation/excelintegration-validation';
import { ExcelIntegrationMapping } from '../mapping/excelintegration-mapping';
import { Stream } from 'stream';
import { Workbook } from 'exceljs'
import { ExcelIntegrationRepository } from '../repositories/excelintegration-repository';

export class ExcelIntegrationAggregate {
    constructor(
        private validation: ExcelIntegrationValidation,
        private mapper: ExcelIntegrationMapping,
        private repository: ExcelIntegrationRepository
    ) { }

    async doAsync(request: ExcelIntegrationRequest, user: any): Promise<ExcelIntegrationResponse> {
        try {
            const validationResponse = await this.validation.validate(request, user);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.id = request.id;
                return validationResponse;
            }

            const result = this.repository.checkPaymentPlan(user);

            if (result) {
                const event = await this.mapper.mapToEvent(request, user);
                const resultEvent = await new ExcelIntegrationProducer().produceAsync(event);

                if (resultEvent) {
                    const response = new ExcelIntegrationResponse(
                        request.id,
                        'ExcelIntegration request success',
                        ResponseStatus.success,
                        200,
                        { resultEvent }
                    );

                    return response;
                } else {
                    const response = new ExcelIntegrationResponse(
                        request.id,
                        'ExcelIntegration request failure',
                        ResponseStatus.failure,
                        500,
                        { resultEvent }
                    );

                    return response;
                }
            } else {
                const response = new ExcelIntegrationResponse(
                    request.id,
                    'This option is not allowed on your plan',
                    ResponseStatus.failure,
                    403,
                    {}
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in ExcelIntegration API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
