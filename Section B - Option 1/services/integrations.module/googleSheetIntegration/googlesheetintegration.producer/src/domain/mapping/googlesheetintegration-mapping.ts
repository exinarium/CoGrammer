import { GoogleSheetIntegrationMessage, GoogleSheetIntegrationEvent, GoogleSheetIntegrationResponse } from '../../../../googlesheetintegration.dto/src';
import { GoogleSheetIntegrationDataModel } from '../../domain/models/googlesheetintegration-datamodel';

export class GoogleSheetIntegrationMapping {
    async map(event: GoogleSheetIntegrationEvent<GoogleSheetIntegrationDataModel>): Promise<GoogleSheetIntegrationMessage<GoogleSheetIntegrationDataModel>> {

        const googlesheetintegrationMessage = new GoogleSheetIntegrationMessage(
            event.id,
            event.data,
            event.version,
            event.producedAt
        );

        return googlesheetintegrationMessage;
    }
}
