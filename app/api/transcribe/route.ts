import { NextResponse } from 'next/server';

const token = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN;

export async function POST(request: Request) {
    try {
        // Get filename from request URL
        const { searchParams } = new URL(request.url);
        const fileUrl = searchParams.get('url'); // Cloudinary's public ID for the file

        const response = await fetch(
            "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/octet-stream",
                },
                method: "POST",
                body: JSON.stringify({ url: fileUrl }),
            }
        );

        const result = await response.json();

        console.log(result);

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error(error);

        // Type assertion to narrow down the unknown type
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