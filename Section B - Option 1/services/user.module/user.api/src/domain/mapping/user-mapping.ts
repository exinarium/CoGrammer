import { UserDataModel } from '../models/user-datamodel';

export class UserMapping {
    mapToModel(request: any): UserDataModel {
        return request;
    }
}
