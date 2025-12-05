# Remotion Captioning Platform

A full-stack web application that automatically generates captions for videos using Google Gemini API and renders them with Remotion. Built with Next.js, TypeScript, and Bun.

## 🎥 Demo

<video src="public/project-demo.mp4" controls width="100%"></video>

## ✨ Features

- **Video Upload**: Simple drag-and-drop interface for MP4 files
- **AI-Powered Captions**: Automatic speech-to-text using Google Gemini API
- **Hinglish Support**: Fully supports mixed Hindi (Devanagari) and English text
- **3 Caption Styles**:
  - **Standard**: Classic bottom-centered subtitles
  - **News**: Top-bar news channel style
  - **Karaoke**: Word-by-word highlighting effect
- **Real-time Preview**: See captions overlaid on video before export
- **High-Quality Export**: Server-side rendering with Remotion

## 🛠 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Video Rendering**: Remotion
- **AI/ML**: Google Gemini API
- **Media Processing**: FFmpeg (via fluent-ffmpeg)

## 📋 Prerequisites

- **Node.js**: Version 20 or higher
- **Bun**: Version 1.2.20 or higher ([Installation guide](https://bun.sh))
- **FFmpeg**: Required for audio extraction ([Installation guide](https://ffmpeg.org/download.html))
- **Google Gemini API Key**: Get one at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installing FFmpeg

#### macOS (using Homebrew):

```bash
brew install ffmpeg
```

#### Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install ffmpeg
```

#### Windows (using Chocolatey):

```bash
choco install ffmpeg
```

## 🚀 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/kabir-fx/Captioning-app.git
cd Captioning-app
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Create required directories

```bash
mkdir -p public/uploads public/outputs tmp
```

### 5. Run the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to Use

1. **Upload a Video**: Drag and drop an MP4 file or click to browse
2. **Generate Captions**: Click "Auto-Generate Captions" to transcribe audio using Gemini API
3. **Choose Style**: Select from Standard, News, or Karaoke caption styles
4. **Preview**: Watch the video with caption overlay in real-time
5. **Export**: Click "Export Captioned Video" to render and download the final video

## 🤖 Caption Generation Method

This application uses **Google Gemini 2.5 Pro** for audio transcription. The process:

1. **Audio Extraction**: FFmpeg extracts audio from the uploaded video as MP3
2. **Transcription**: Audio is sent to Gemini API with a structured prompt requesting:
   - Timestamped caption segments (start/end times in seconds)
   - Support for both English and Hindi (Devanagari script)
   - Natural sentence/phrase segmentation (3-8 seconds per segment)
3. **Fallback**: If timestamped transcription fails, a simple full-text transcription is used with estimated timing

The system automatically handles both English and Hindi text, rendering them correctly using Noto Sans and Noto Sans Devanagari fonts.

## 🌐 Deployment

### Deploy to Vercel

1. **Prepare for deployment**:

   - Ensure your project is pushed to a GitHub repository.
   - Configure your Vercel project settings to use **Bun** as the package manager.

2. **Environment Variables**:

   - Add `GEMINI_API_KEY` to your Vercel project environment variables.

3. **Deploy**:
   - Connect your repository to Vercel and deploy.

### Important Notes for Production

- **FFmpeg Availability**: Ensure FFmpeg is installed on your deployment platform.
  - For Vercel, you may need to use a build step to include FFmpeg or use a dockerized deployment if standard serverless functions don't support it easily.
- **File Storage**: Vercel has an ephemeral filesystem. For a real production app:
  - Use cloud storage (AWS S3, Cloudflare R2, etc.) for uploaded videos.
  - Store rendered videos externally.
- **Execution Time Limits**:
  - Vercel Hobby: 10-second limit (may be too short for rendering).
  - Vercel Pro: 60-second limit.
  - **Recommendation**: For heavy video processing, consider offloading rendering to a dedicated worker service or using Remotion Lambda.

## 📁 Project Structure

```
captioning-app/
├── app/
│   ├── api/
│   │   ├── generate-captions/          # Caption generation with Gemini
│   │   ├── render/                     # Video rendering with Remotion
│   │   └── upload/                     # Video upload endpoint
│   ├── globals.css                     # Global styles
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Main application page
├── components/
│   ├── CaptionStyleSelector.tsx        # UI for selecting caption styles
│   ├── ExportButton.tsx                # Triggers video rendering
│   ├── VideoPreview.tsx                # Real-time preview player
│   └── VideoUploader.tsx               # Drag-and-drop video upload
├── lib/
│   ├── ffmpeg.ts                       # FFmpeg utilities for audio extraction
│   ├── gemini.ts                       # Gemini API client for transcription
│   └── types.ts                        # Shared TypeScript definitions
├── public/
│   ├── fonts/                          # Custom fonts
│   └── uploads/                        # Uploaded videos storage
└── remotion/
    ├── captions/
    │   ├── KaraokeCaption.tsx          # Karaoke-style animated captions
    │   ├── NewsCaption.tsx             # News ticker style captions
    │   └── StandardCaption.tsx         # Standard bottom-centered captions
    ├── Composition.tsx                 # Main video composition logic
    ├── index.ts                        # Remotion entry point
    └── Root.tsx                        # Remotion root component
```

## 🎨 Caption Styles

### Standard>

- **Position**: Bottom-center
- **Appearance**: White text with black outline
- **Best for**: Traditional subtitles, movies

### News

- **Position**: Top-bar
- **Appearance**: Bold uppercase text on dark background with red accent
- **Best for**: News broadcasts, announcements

### Karaoke

- **Position**: Center
- **Appearance**: Yellow highlighted text with word-by-word progression
- **Best for**: Music videos, singalongs

## 🔧 Development Commands

```bash
# Start development server
bun dev

# Build for production
bun run build

# Start production server
bun start

# Run linter
bun run lint
```

## 🐛 Troubleshooting

### FFmpeg not found

Ensure FFmpeg is installed and accessible in your PATH:

```bash
ffmpeg -version
```

### Gemini API errors

- Verify your API key is correct in `.env.local`
- Check your API quota at [Google AI Studio](https://aistudio.google.com)
- Ensure the audio file is in a supported format

### Video rendering timeout

- Reduce video length or resolution
- For production, use external rendering services
- On Vercel, upgrade to Pro plan for longer execution time

### Caption alignment issues

- Verify fonts are loaded correctly
- Check browser console for font loading errors
- Ensure Devanagari text is properly encoded in UTF-8

## 📦 Sample Videos

Sample videos and their captioned outputs can be found in the `samples/` directory (note: not included in git repository due to file size).

To test the application:

1. Use any MP4 video with clear audio dialogue
2. Videos with both English and Hindi speech work best to demonstrate Hinglish support

## 🤝 Contributing

This is a demonstration project built for the Remotion Captioning Platform task. Feel free to fork and modify for your own use.

## 📄 License

MIT License - Feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- **Remotion**: For amazing video rendering capabilities
- **Google Gemini**: For powerful AI transcription
- **Next.js**: For the excellent full-stack framework
- **Vercel**: For seamless deployment

---

**GitHub Repository**: [Your repository URL]

Built with ❤️ using Next.js, Bun, Remotion, and Gemini AI
