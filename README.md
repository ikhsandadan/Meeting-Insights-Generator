
# Meeting Insights Generator 🎙️

[![Vercel](https://img.shields.io/badge/Vercel-Deployed-brightgreen)](https://meeting-insights-generator-alpha.vercel.app/)

Transform your meetings into actionable insights! Meeting Insights Generator is a powerful web application that transcribes audio/video meetings and generates AI-powered summaries from your conversations.

![Meeting Insights Demo](https://via.placeholder.com/800x400.png?text=Meeting+Insights+Demo)

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
Create a `.env.local` file in the root directory:
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


![Upload Interface](https://via.placeholder.com/400x300.png?text=Upload+Interface)


![Processing View](https://via.placeholder.com/400x300.png?text=Processing+View)


![Results Dashboard](https://via.placeholder.com/400x300.png?text=Results+Dashboard)

## 🚀 Live Demo

Check out the live demo at: [Meeting Insights Generator Demo](https://meeting-insights-generator-alpha.vercel.app/)


---

Built with ❤️ by [@Nashki](https://x.com/Ikhsan_dadan)
