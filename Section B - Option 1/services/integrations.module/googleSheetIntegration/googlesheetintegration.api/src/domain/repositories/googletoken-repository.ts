import { google } from 'googleapis';
import { GoogleConfig } from '../config/google-config';
import { Config } from '../config/config';

export class GoogleTokenRepository {

  constructor(private config: Config) { }

  async getAccessToken(code: string, oauth2Client: any) {

    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      return tokens;
    } catch (err) {
      const error = '';
    }
  }


}