import { NextResponse } from 'next/server';

const token = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN;

export async function POST(request: Request) {
    try {
        // Get fileUrl from request URL
        const { searchParams } = new URL(request.url);
        const fileUrl = searchParams.get('fileUrl'); // Cloudinary's URL for the file

        if (!fileUrl) {
            return NextResponse.json(
                { error: 'URL not provided' },
                { status: 400 }
            );
        }

        console.log('File URL:', fileUrl);

        // Fetch from Hugging Face API
        const response = await fetch(
            "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ url: fileUrl }),
            }
        );

        if (!response.ok) {
            throw new Error(`Hugging Face API error: ${response.statusText}`);
        }

        const result = await response.json();

        console.log('Hugging Face API response:', result);

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error('Error during the transcription process:', error);

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
