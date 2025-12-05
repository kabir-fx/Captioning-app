import { GoogleGenerativeAI } from '@google/generative-ai';
import { Caption } from './types';
import * as fs from 'fs';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Use Gemini 2.5 Pro for audio understanding
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

/**
 * Extract audio transcription with timestamps from a video file using Gemini API
 * @param audioPath Path to the audio file (extracted from video)
 * @returns Array of captions with timestamps
 */
export async function generateCaptionsFromAudio(
  audioPath: string
): Promise<Caption[]> {
  try {
    // Read audio file
    const audioData = fs.readFileSync(audioPath);
    const audioBase64 = audioData.toString('base64');

    const prompt = `You are a speech-to-text transcription system. Transcribe the following audio and provide timestamps for each sentence or phrase.

Return the transcription in the following JSON format:
{
  "captions": [
    {
      "text": "transcribed text here",
      "startTime": 0.0,
      "endTime": 2.5
    }
  ]
}

Rules:
1. Provide accurate timestamps in seconds
2. Support both English and Hindi (Devanagari script)
3. Break transcription into natural sentence/phrase segments
4. Each segment should be 3-8 seconds for readability
5. Return ONLY the JSON, no other text

Transcribe this audio:`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'audio/mp3',
          data: audioBase64,
        },
      },
      { text: prompt },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Gemini response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.captions || [];
  } catch (error) {
    console.error('Error generating captions:', error);
    throw new Error(`Caption generation failed: ${error}`);
  }
}

/**
 * Fallback: Generate simple captions without word-level timing
 * This is used as backup if the main method fails
 */
export async function generateSimpleCaptions(
  audioPath: string
 ): Promise<Caption[]> {
  try {
    const audioData = fs.readFileSync(audioPath);
    const audioBase64 = audioData.toString('base64');

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'audio/mp3',
          data: audioBase64,
        },
      },
      {
        text: 'Transcribe this audio. Support both English and Hindi text. Return only the transcription.',
      },
    ]);

    const response = await result.response;
    const transcription = response.text();

    // Split into sentences and create approximate timestamps
    const sentences = transcription
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    const avgDuration = 4; // average 4 seconds per sentence

    return sentences.map((sentence, index) => ({
      text: sentence.trim(),
      startTime: index * avgDuration,
      endTime: (index + 1) * avgDuration,
    }));
  } catch (error) {
    console.error('Error in simple caption generation:', error);
    throw error;
  }
}
