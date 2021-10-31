import { User } from '../models/user';

export interface IJWTMapping {
    mapToModel(decodedToken: any): Promise<User>;
}
