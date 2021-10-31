import { MetadataModel } from '../models/metadataModel';

export interface IMapping {
    map(
        request: any,
        response: any,
        responseTimestamp: string,
        requesTimestamp: string,
        requestDuration: number
    ): MetadataModel;
}
