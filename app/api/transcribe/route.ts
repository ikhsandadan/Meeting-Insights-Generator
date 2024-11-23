import { NextResponse } from 'next/server';

const token = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN;
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkStatus(taskUrl: string): Promise<any> {
  const response = await fetch(taskUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('fileUrl');

    if (!fileUrl) {
      return NextResponse.json(
        { error: 'File URL is required' },
        { status: 400 }
      );
    }

    // Initial request to start transcription
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

    const initialResult = await response.json();

    // Check if we got an immediate result
    if (!initialResult.error) {
      return NextResponse.json(initialResult);
    }

    // If we got a task URL, poll for results
    if (initialResult.task_url) {
      let attempts = 0;
      while (attempts < MAX_RETRIES) {
        await wait(INITIAL_DELAY * Math.pow(2, attempts)); // Exponential backoff
        const result = await checkStatus(initialResult.task_url);
        
        if (result.status === 'completed') {
          return NextResponse.json(result);
        }
        
        if (result.status === 'error') {
          throw new Error(result.error || 'Task failed');
        }
        
        attempts++;
      }
      
      throw new Error('Maximum retries reached');
    }

    // If we got here, something went wrong
    throw new Error(initialResult.error || 'Unknown error occurred');

  } catch (error: unknown) {
    console.error('Transcription error:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        error: 'Error while transcribing audio: ' + errorMessage,
        details: 'If the file is large, try breaking it into smaller segments'
      },
      { status: 500 }
    );
  }
}
