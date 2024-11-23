'use client';

import { useState, useRef } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { FileText, Image, Download, Upload, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/alert';
import Visualizations from './components/Visualizations';
import { Visualization, Keyword } from './types';

const MeetingInsights = () => {
  const [transcription, setTranscription] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats: string[] = [
    'audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/webm',
    'video/mp4', 'video/webm', 'video/quicktime'
  ];

  import axios, { AxiosProgressEvent } from 'axios';

  const processAudioData = async (audioBlob: Blob): Promise<void> => {
      try {
          setLoading(true);
          const formData = new FormData();
          formData.append('audio', audioBlob);
  
          // Upload audio
          const data = await axios.post('/api/upload', formData, {
              onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                  if (progressEvent.lengthComputable) {
                      const progress = progressEvent.total !== undefined 
                          ? (progressEvent.loaded / progressEvent.total) * 100 
                          : 0;
                      setUploadProgress(Math.round(progress));
                  }
              },
          });
  
          // Check if the upload was successful and begin transcription
          if (data.status === 200) {
              const res = await axios.post(`/api/transcribe?fileUrl=${data.data.secure_url}`);
  
              if (res.status === 200) {
                  const { taskId } = res.data;
  
                  // Polling function to check the status
                  const pollTranscriptionStatus = async (taskId: string): Promise<void> => {
                      try {
                          const statusRes = await axios.get(`/api/transcription-status?taskId=${taskId}`);
                          if (statusRes.status === 200) {
                              const { status, text } = statusRes.data;
                              if (status === 'completed') {
                                  await generateSummary(text);
  
                                  // Delete uploaded file
                                  await fetch(`/api/delete?publicId=${data.data.public_id}`, { method: 'DELETE' });
  
                                  setTranscription(text);
                                  setLoading(false);
                              } else if (status === 'processing') {
                                  // Wait for some time and then poll again
                                  setTimeout(() => pollTranscriptionStatus(taskId), 5000);
                              } else {
                                  setError('Transcription failed or is in an unknown state');
                                  setLoading(false);
                              }
                          } else {
                              setError('Failed to get transcription status');
                              setLoading(false);
                          }
                      } catch (err) {
                          setError(`Error while polling transcription status: ${err instanceof Error ? err.message : 'Unknown error'}`);
                          setLoading(false);
                      }
                  };
  
                  // Start polling
                  pollTranscriptionStatus(taskId);
  
              } else {
                  setError('Error starting transcription');
                  setLoading(false);
              }
          } else {
              setError('Failed to upload audio');
              setLoading(false);
          }
      } catch (err) {
          setError(`Error while processing audio: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setLoading(false);
      }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!supportedFormats.includes(file.type)) {
      setError('Format file not supported, Please upload a file in the following formats: ' + supportedFormats.join(', '));
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);
    await processAudioData(file);
  };

  const generateSummary = async (text: string): Promise<void> => {
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) throw new Error('Failed to generate summary');

      const result = await response.json();
      setSummary(result.summary);
      await generateKeywords(text);
    } catch (err) {
      setError(`Error while generating summary: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const generateKeywords = async (text: string): Promise<void> => {
    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) throw new Error('Failed to generate keywords');

      const result = await response.json();
      generateVisualizations(result.keywords);
    } catch (err) {
      setError(`Error error while generating keywords: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const generateVisualizations = (keywords: Keyword[]): void => {
    const visualizationData: Visualization[] = [
      {
        title: 'Main Topic',
        type: 'wordcloud',
        data: keywords.map(k => ({ text: k.label, value: Math.round(k.score * 100) })),
      },
      {
        title: 'Distribution by Topic',
        type: 'pie',
        data: keywords.map(k => ({ name: k.label, value: Math.round(k.score * 100) })),
      },
    ];

    setVisualizations(visualizationData);
  };

  const exportResults = (): void => {
    const exportData = {
      transcription,
      summary,
      visualizations,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-insights-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Meeting Insights Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept={supportedFormats.join(',')}
              onChange={handleFileUpload}
            />
            <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="mr-2 h-4 w-4" /> Upload Audio/Video
            </Button>
            {selectedFile && (
              <Alert>
                <AlertDescription className="text-md">
                  Selected File: <span className="font-bold">{selectedFile.name}</span>
                </AlertDescription>
              </Alert>
            )}
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {loading && (
            <Alert className="mt-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <AlertDescription> Processing... Please wait. </AlertDescription>
            </Alert>
          )}
          {transcription && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-xl">
                  <FileText className="inline mr-2" /> Transcription Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-mono text-md">{transcription}</pre>
              </CardContent>
            </Card>
          )}
          {summary && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-xl">
                  <FileText className="inline mr-2" /> AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-mono text-md">{summary}</pre>
              </CardContent>
            </Card>
          )}
          {visualizations.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-xl">
                  <Image className="inline mr-2" /> Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Visualizations visualizations={visualizations} />
              </CardContent>
            </Card>
          )}
          {summary && (
            <Button onClick={exportResults} className="mt-4">
              <Download className="mr-2 h-4 w-4" /> Exported Results
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingInsights;
