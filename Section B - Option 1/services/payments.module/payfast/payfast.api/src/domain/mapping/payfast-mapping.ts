import { PayfastDataModel } from '../models/payfast-datamodel';

export class PayfastMapping {
    mapToModel(request: any): Promise<PayfastDataModel> {
        return request;
    }
}
