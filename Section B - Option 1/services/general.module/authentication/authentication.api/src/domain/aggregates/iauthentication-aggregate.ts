import { AuthenticationResponse, AuthenticationRequest } from '../../../../authentication.dto';

export interface IAuthenticationAggregate {
    generateTokenAsync(data: AuthenticationRequest): Promise<AuthenticationResponse>;
}
