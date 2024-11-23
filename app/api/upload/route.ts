import { NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

const allowedTypes = [
    'audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/webm',
    'video/mp4', 'video/webm', 'video/quicktime'
];

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('audio') as File;

        if (!file || !allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'File type not supported' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload file to Cloudinary
        const result = await new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error("Upload result is undefined"));
                    resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error(error);

        // Handle error and return appropriate response
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: 'Error while transcribing audio: ' + errorMessage },
            { status: 500 }
        );
    }
}