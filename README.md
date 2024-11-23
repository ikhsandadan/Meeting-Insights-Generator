
# Meeting Insights Generator 🎙️

[![Vercel](https://img.shields.io/badge/Vercel-Deployed-brightgreen)](https://meeting-insights-generator-alpha.vercel.app/)

Transform your meetings into actionable insights! Meeting Insights Generator is a powerful web application that transcribes audio/video meetings and generates AI-powered summaries from your conversations.


![1](https://github.com/user-attachments/assets/f8396cfc-8329-449f-931a-aa6215ea343d)



## ✨ Features

- 🎯 **Automatic Transcription**: Convert audio/video content into accurate text
- 🤖 **AI-Powered Summaries**: Get concise summaries of your meetings
- ⚡ **Real-time Progress**: Monitor upload and processing progress
- 📤 **Export Functionality**: Save results in JSON format for future reference
- ⏱️ **Performance Metrics**: Track processing time for optimization

## 🔄 Workflow

1. **Upload Phase**
   - User uploads audio/video file
   - Supported formats: WAV, MP3, MP4, WebM, QuickTime
   - Real-time upload progress tracking

2. **Processing Phase**
   - File transcription using API
   - AI summary generation

3. **Output Phase**
   - Display transcription text
   - Show AI-generated summary
   - Option to export all results

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/ikhsandadan/meeting-insights-generator.git
cd meeting-insights-generator
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_HUGGING_FACE_TOKEN='YOUR_HUGGINGFACE_TOKEN'

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME='YOUR_CLOUDINARY_CLOUD_NAME'

NEXT_PUBLIC_CLOUDINARY_API_KEY='YOUR_CLOUDINARY_API_KEY'

NEXT_PUBLIC_CLOUDINARY_API_SECRET='YOUR_CLOUDINARY_API_SECRET'
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🖼️ Screenshots



![2](https://github.com/user-attachments/assets/d3ce3a8b-fbf8-4953-804b-6331d02c3521)



![3](https://github.com/user-attachments/assets/3c850f1b-da64-452c-9a77-fc5d434758e7)



![4](https://github.com/user-attachments/assets/17263896-94a2-45ac-bf4c-f7eed4648e48)



## 🚀 Live Demo

Check out the live demo at: [Meeting Insights Generator Demo](https://meeting-insights-generator-alpha.vercel.app/)

if you want to try you can use this file to test the app:  [Meeting Audio File Demo]([https://meeting-insights-generator-alpha.vercel.app/](https://github.com/ikhsandadan/Meeting-Insights-Generator/blob/main/Special%20Meeting%20-%2001_10_2022_2.mp3))


---

Built with ❤️ by [@Nashki](https://x.com/Ikhsan_dadan)
