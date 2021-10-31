export interface IKeyRespository {
    getEncryptionKeyAsync(type: string): Promise<string>;
}
