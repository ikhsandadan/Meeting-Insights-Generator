import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
    try {
        // Get publicId from request URL
        const { searchParams } = new URL(request.url);
        const publicId = searchParams.get('publicId'); // Cloudinary's public ID for the file

        if (!publicId) {
            return NextResponse.json(
                { error: 'publicId not provided' },
                { status: 400 }
            );
        }

        const result = await cloudinary.api.delete_resources(
            [publicId],
            { type: 'upload', resource_type: 'video' }
        );

        if (result.deleted[publicId] !== 'deleted') {
            return NextResponse.json(
                { error: 'File not found or could not be deleted' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'File successfully deleted',
            filename: publicId
        });

    } catch (error: unknown) {
        console.error('Error deleting file:', error);

        // Error handling
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: 'Error while deleting file: ' + errorMessage },
            { status: 500 }
        );
    }
}