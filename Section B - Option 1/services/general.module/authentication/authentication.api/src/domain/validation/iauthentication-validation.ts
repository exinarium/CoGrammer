import { AuthenticationRequest, AuthenticationResponse } from '../../../../authentication.dto/src';

export interface IAuthenticationValidation {
    validate(request: AuthenticationRequest): Promise<AuthenticationResponse>;
}
