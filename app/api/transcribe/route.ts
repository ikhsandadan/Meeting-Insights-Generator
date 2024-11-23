import { NextResponse } from 'next/server';

const token = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN;

export async function POST(request: Request) {
    try {
        // Get filename from request URL
        const { searchParams } = new URL(request.url);
        const fileUrl = searchParams.get('url'); // Cloudinary's URL for the file

        if (!fileUrl) {
            return NextResponse.json(
                { error: 'URL not provided' },
                { status: 400 }
            );
        }

        console.log('Sending request to Hugging Face with URL:', fileUrl);

        const response = await fetch(
            "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json", // Change content type to JSON
                },
                method: "POST",
                body: JSON.stringify({ url: fileUrl }),
                // Increase timeout for the fetch request
                timeout: 10000 // Timeout set to 10 seconds
            }
        );

        const result = await response.json();

        console.log('Received response from Hugging Face:', result);

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error('Error during the transcription process:', error);

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
