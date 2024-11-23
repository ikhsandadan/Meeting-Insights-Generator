import { NextResponse } from 'next/server';

const token = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN;

async function query(data: { inputs: string }) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}

export async function POST(request: Request) {
    try {
        // Get the text from request body
        const { text } = await request.json();

        // Validate input
        if (!text || typeof text !== 'string') {
            return NextResponse.json(
                { error: 'Text input not valid' },
                { status: 400 }
            );
        }

        // Validate text length
        if (text.length < 10) {
            return NextResponse.json(
                { error: 'Text input too short' },
                { status: 400 }
            );
        }

        // Call Hugging Face API
        const result = await query({ inputs: text });

        // Check if result is an error
        if (result.error) {
            throw new Error(result.error);
        }

        // Get the summary from the result
        const summary = Array.isArray(result) ? result[0].summary_text : result.summary_text;

        if (!summary) {
            throw new Error('No summary found');
        }

        // Return the summary
        return NextResponse.json({
            summary: summary,
            message: 'Summary generated successfully'
        });

    } catch (error: unknown) {
        console.error('Error in summarization:', error);

        // Type assertion to narrow down the unknown type
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: 'Error while generating summary: ' + errorMessage },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '2mb',
        },
    },
};
