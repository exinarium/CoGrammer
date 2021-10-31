import { Authentication } from '../models/authentication';
import { User } from '../models/user';

export interface IAuthenticationRepository {
    authUserAsync(model: Authentication): Promise<User>;
}
