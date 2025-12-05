import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import { ReadableStream } from 'stream/web';

/**
 * Download a file from a URL to a temporary file
 * @param url The URL to download from
 * @param extension The file extension (e.g., '.mp4')
 * @returns The path to the downloaded temporary file
 */
export async function downloadToTemp(url: string, extension: string): Promise<string> {
  const tempDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filename = `${crypto.randomUUID()}${extension}`;
  const filepath = path.join(tempDir, filename);

  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  const fileStream = fs.createWriteStream(filepath);
  // @ts-ignore - Readable.fromWeb is available in Node 18+ but types might be missing
  await finished(Readable.fromWeb(response.body as ReadableStream).pipe(fileStream));

  return filepath;
}
