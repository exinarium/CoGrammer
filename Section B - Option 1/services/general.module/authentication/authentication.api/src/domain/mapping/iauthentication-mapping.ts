import { Authentication } from '../models/authentication';
import { AuthenticationRequest } from '../../../../authentication.dto/src';

export interface IAuthenticationMapping {
    mapToModel(request: AuthenticationRequest): Promise<Authentication>;
}
