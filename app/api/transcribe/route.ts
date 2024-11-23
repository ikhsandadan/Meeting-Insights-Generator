import { NextResponse } from 'next/server';

const token = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN;

export async function POST(request: Request) {
    try {
        // Get filename from request URL
        const { searchParams } = new URL(request.url);
        const fileUrl = searchParams.get('fileUrl'); // Cloudinary's URL for the file

        if (!fileUrl) {
            return NextResponse.json(
                { error: 'URL not provided' },
                { status: 400 }
            );
        }

        const response = await fetch(
            "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    url: fileUrl,
                    webhook: "https://your-vercel-app-url/api/webhook", // Ganti dengan URL webhook Anda
                }),
            }
        );

        const result = await response.json();

        console.log(result);

        return NextResponse.json({ message: "Transcription request received", result });
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
