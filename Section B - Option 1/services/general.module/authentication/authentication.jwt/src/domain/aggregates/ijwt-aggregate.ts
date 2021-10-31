import { User } from '../models/user';

export interface IJWAggregate {
    validateTokenAsync(token: string): Promise<User>;
}
