import { NextResponse } from 'next/server';
import { Keyword } from '../../types';

const token = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN;

async function query(data: { inputs: string }) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/ml6team/keyphrase-extraction-kbir-inspec",
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
                { error: 'Text input is too short' },
                { status: 400 }
            );
        }

        // Call Hugging Face API
        const result = await query({ inputs: text });

        // Check if result is an error
        if (result.error) {
            throw new Error(result.error);
        }

        // Process and format keywords with their scores
        let keywordsWithScores: Keyword[] = [];
        if (Array.isArray(result)) {
            keywordsWithScores = result
                .filter((item: { score: number }) => item.score > 0.5) // Filter keywords with confidence > 50%
                .slice(0, 10) // Get top 10 keywords
                .map((item: { word: string; score: number }) => ({
                    label: item.word,
                    score: item.score,
                }));
        }

        if (keywordsWithScores.length === 0) {
            throw new Error('No keywords found');
        }

        // Return the keywords with their scores
        return NextResponse.json({
            keywords: keywordsWithScores,
            message: 'Keywords successfully extracted'
        });

    } catch (error: unknown) {
        console.error('Error in keyword extraction:', error);

        // Type assertion to narrow down the unknown type
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: 'Error while extracting keywords: ' + errorMessage },
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
}