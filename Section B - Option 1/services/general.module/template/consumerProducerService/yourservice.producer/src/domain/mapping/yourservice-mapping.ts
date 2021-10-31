import { YourServiceMessage, YourServiceEvent, YourServiceResponse } from '../../../../yourservice.dto/src';
import { YourServiceDataModel } from '../../domain/models/yourservice-datamodel';

export class YourServiceMapping {
    async map(event: YourServiceEvent<YourServiceDataModel>): Promise<YourServiceMessage<YourServiceDataModel>> {

        const yourserviceMessage = new YourServiceMessage(
            event.id,
            event.data,
            event.version,
            event.producedAt
        );

        return yourserviceMessage;
    }
}
