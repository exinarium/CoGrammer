import { MetadataModel } from '../models/metadataModel';

export interface IRepository {
    WriteAsync(data: MetadataModel): void;
}
