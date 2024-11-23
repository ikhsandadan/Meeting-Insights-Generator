import { NextResponse } from 'next/server';

const token = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN;

async function fetchWithRetry(url, options, retries = 3) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying... (${3 - retries + 1})`);
            return fetchWithRetry(url, options, retries - 1);
        } else {
            throw error;
        }
    }
}

export async function POST(request: Request) {
    try {
        // Get filename from request URL
        const { searchParams } = new URL(request.url);
        const fileUrl = searchParams.get('fileUrl'); // Cloudinary's url for the file

        const response = await fetchWithRetry("https://api-inference.huggingface.co/models/openai/whisper-large-v3", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/octet-stream",
            },
            method: "POST",
            body: JSON.stringify({ url: fileUrl }),
        });


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
