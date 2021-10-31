import { ExcelIntegrationRequest, ExcelIntegrationEvent, ExcelIntegrationResponse } from '../../../../excelintegration.dto/src';
import { ExcelIntegrationDataModel } from '../models/excelintegration-datamodel';
import { ObjectId } from 'mongodb';

export class ExcelIntegrationMapping {
    async mapToEvent(request: ExcelIntegrationRequest, user: any): Promise<ExcelIntegrationEvent<ExcelIntegrationDataModel>> {
        const excelintegrationEvent = new ExcelIntegrationEvent(
            new ObjectId(),
            new Date(),
            'ExcelIntegrationEvent',
            new ExcelIntegrationDataModel(request.exportType, request.emailAddress, user.organizationId),
            1,
            request.produceMessage
        );

        return excelintegrationEvent;
    }
}
