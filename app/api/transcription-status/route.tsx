import { NextResponse } from 'next/server';

const token = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN;

export async function GET(request: Request) {
    try {
        // Get task ID from request URL
        const { searchParams } = new URL(request.url);
        const taskId = searchParams.get('taskId'); // Task ID for the transcription

        if (!taskId) {
            return NextResponse.json(
                { error: 'Task ID not provided' },
                { status: 400 }
            );
        }

        // Check transcription status
        const response = await fetch(
            `https://api-inference.huggingface.co/status/${taskId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Hugging Face API error: ${response.statusText}`);
        }

        const result = await response.json();

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error('Error checking transcription status:', error);

        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: 'Error checking transcription status: ' + errorMessage },
            { status: 500 }
        );
    }
}
