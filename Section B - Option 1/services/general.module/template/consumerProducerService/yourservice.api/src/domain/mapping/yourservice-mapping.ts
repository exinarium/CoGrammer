import { YourServiceRequest, YourServiceEvent, YourServiceResponse } from '../../../../yourservice.dto/src';
import { YourServiceDataModel } from '../models/yourservice-datamodel';
import { ObjectId } from 'mongodb';

export class YourServiceMapping {
    async mapToEvent(request: YourServiceRequest): Promise<YourServiceEvent<YourServiceDataModel>> {
        const yourserviceEvent = new YourServiceEvent(
            new ObjectId(),
            new Date(),
            'YourServiceEvent',
            request,
            1,
            request.produceMessage
        );

        return yourserviceEvent;
    }
}
