export declare class CreateAssetFolderDto {
    name: string;
    parentId?: string;
    clientId?: string;
}
export declare class UploadRequestDto {
    filename: string;
    mimeType: string;
    sizeBytes: number;
    folderId?: string;
    clientId?: string;
}
export declare class RenameAssetDto {
    name: string;
}
export declare class MoveAssetDto {
    folderId?: string | null;
}
