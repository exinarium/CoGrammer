import { IAuthenticationMapping } from './iauthentication-mapping';
import { Authentication } from '../models/authentication';
import { AuthenticationRequest } from '../../../../authentication.dto/src';

export class AuthenticationMapping implements IAuthenticationMapping {
    async mapToModel(request: AuthenticationRequest): Promise<Authentication> {
        return new Authentication(request.email, request.password);
    }
}
