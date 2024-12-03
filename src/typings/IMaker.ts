export interface IMaker {
    success: boolean;
    imageUrl: string;
    session_id: string;
}

export interface UploadResult {
    success: boolean;
    info: string;
    code: number;
    uploaded_file: string;
    thumb_file: string;
    icon_file: string;
}