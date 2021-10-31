import { YourServiceDataModel } from '../models/yourservice-datamodel';

export class YourServiceMapping {
    mapToModel(request: any): Promise<YourServiceDataModel> {
        return request;
    }
}
