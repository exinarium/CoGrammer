import { ExcelIntegrationMessage, ExcelIntegrationEvent, ExcelIntegrationResponse } from '../../../../excelintegration.dto/src';
import { ExcelIntegrationDataModel } from '../../domain/models/excelintegration-datamodel';

export class ExcelIntegrationMapping {
    async map(event: ExcelIntegrationEvent<ExcelIntegrationDataModel>): Promise<ExcelIntegrationMessage<ExcelIntegrationDataModel>> {

        const excelintegrationMessage = new ExcelIntegrationMessage(
            event.id,
            event.data,
            event.version,
            event.producedAt
        );

        return excelintegrationMessage;
    }
}
