import { IMapping } from './imapping';
import { MetadataModel } from '../models/metadataModel';

export class Mapping implements IMapping {
    map(
        request: any,
        response: any,
        responseTimestamp: string,
        requesTimestamp: string,
        requestDuration: number
    ): MetadataModel {
        const model = new MetadataModel(
            requesTimestamp,
            JSON.stringify(request.body),
            responseTimestamp,
            response.body,
            response.statusCode,
            request.method,
            requestDuration
        );

        return model;
    }
}
