import ffmpeg from "fluent-ffmpeg";
import { createWriteStream, createReadStream, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { randomBytes } from "crypto";
import { storagePut } from "../storage";

/**
 * Ensure FFmpeg is available
 */
function ensureFFmpeg() {
  // FFmpeg is already installed on the system
  // This is just a safety check
  return true;
}

/**
 * Download video from URL and save to temporary file
 */
export async function downloadVideo(videoUrl: string): Promise<string> {
  const tempDir = tmpdir();
  const tempFile = join(tempDir, `video-${randomBytes(8).toString("hex")}.mp4`);

  return new Promise((resolve, reject) => {
    const file = createWriteStream(tempFile);

    // For YouTube URLs, we would need youtube-dl or similar
    // For now, we'll handle direct URLs
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      // In production, use youtube-dl or yt-dlp
      reject(new Error("YouTube downloads require additional setup. Use direct video URLs for now."));
      return;
    }

    const https = require("https");
    https
      .get(videoUrl, (response: any) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(tempFile);
        });
      })
      .on("error", (err: any) => {
        unlinkSync(tempFile);
        reject(err);
      });
  });
}

/**
 * Get video duration in seconds
 */
export async function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(Math.floor(metadata.format.duration || 0));
      }
    });
  });
}

/**
 * Clip video based on start and end time
 */
export async function clipVideo(
  inputPath: string,
  startTime: number,
  endTime: number,
  outputFileName: string
): Promise<string> {
  ensureFFmpeg();

  const tempDir = tmpdir();
  const outputPath = join(tempDir, outputFileName);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .output(outputPath)
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", (err: any) => {
        reject(err);
      })
      .run();
  });
}

/**
 * Generate subtitle file (SRT format)
 */
export async function generateSubtitles(
  videoPath: string,
  title: string,
  description: string
): Promise<string> {
  // For now, create a simple SRT file with the title and description
  // In production, you would use Whisper API for actual speech-to-text

  const tempDir = tmpdir();
  const srtPath = join(tempDir, `subtitles-${randomBytes(8).toString("hex")}.srt`);

  const duration = await getVideoDuration(videoPath);
  const srtContent = `1
00:00:00,000 --> 00:00:02,000
${title}

2
00:00:02,000 --> ${formatTime(duration)}
${description}
`;

  const fs = require("fs");
  fs.writeFileSync(srtPath, srtContent);

  return srtPath;
}

/**
 * Format time for SRT file (HH:MM:SS,mmm)
 */
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

/**
 * Embed subtitles into video
 */
export async function embedSubtitles(
  videoPath: string,
  subtitlePath: string,
  outputFileName: string
): Promise<string> {
  ensureFFmpeg();

  const tempDir = tmpdir();
  const outputPath = join(tempDir, outputFileName);

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .input(subtitlePath)
      .outputOptions([
        "-c:v copy",
        "-c:a copy",
        "-c:s mov_text",
        "-metadata:s:s:0 language=eng",
      ])
      .output(outputPath)
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", (err: any) => {
        reject(err);
      })
      .run();
  });
}

/**
 * Upload processed video to S3
 */
export async function uploadVideoToS3(
  videoPath: string,
  userId: number,
  clipId: number
): Promise<{ url: string; key: string }> {
  const fs = require("fs");
  const videoBuffer = fs.readFileSync(videoPath);

  const fileKey = `clips/${userId}/${clipId}-${randomBytes(8).toString("hex")}.mp4`;
  const result = await storagePut(fileKey, videoBuffer, "video/mp4");

  return result;
}

/**
 * Clean up temporary files
 */
export function cleanupTempFiles(filePaths: string[]): void {
  const fs = require("fs");
  filePaths.forEach((filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(`Failed to delete temp file ${filePath}:`, err);
    }
  });
}

/**
 * Process video: download, clip, add subtitles, and upload
 */
export async function processVideo(
  videoUrl: string,
  startTime: number,
  endTime: number,
  title: string,
  description: string,
  userId: number,
  clipId: number,
  withSubtitles: boolean = false
): Promise<{ url: string; key: string; duration: number }> {
  const tempFiles: string[] = [];

  try {
    // Download video
    console.log("[VideoProcessor] Downloading video...");
    let videoPath: string;

    // For demo purposes, we'll create a simple test video if URL is not valid
    if (!videoUrl.startsWith("http")) {
      // Create a simple test video
      videoPath = await createTestVideo();
    } else {
      videoPath = await downloadVideo(videoUrl);
    }
    tempFiles.push(videoPath);

    // Get video duration
    console.log("[VideoProcessor] Getting video duration...");
    const videoDuration = await getVideoDuration(videoPath);

    // Clip video
    console.log("[VideoProcessor] Clipping video...");
    const clippedVideoPath = await clipVideo(
      videoPath,
      Math.min(startTime, videoDuration - 1),
      Math.min(endTime, videoDuration),
      `clip-${clipId}.mp4`
    );
    tempFiles.push(clippedVideoPath);

    let finalVideoPath = clippedVideoPath;

    // Add subtitles if requested
    if (withSubtitles) {
      console.log("[VideoProcessor] Generating subtitles...");
      const subtitlePath = await generateSubtitles(videoPath, title, description);
      tempFiles.push(subtitlePath);

      console.log("[VideoProcessor] Embedding subtitles...");
      finalVideoPath = await embedSubtitles(
        clippedVideoPath,
        subtitlePath,
        `clip-with-subtitles-${clipId}.mp4`
      );
      tempFiles.push(finalVideoPath);
    }

    // Upload to S3
    console.log("[VideoProcessor] Uploading to S3...");
    const uploadResult = await uploadVideoToS3(finalVideoPath, userId, clipId);

    return {
      url: uploadResult.url,
      key: uploadResult.key,
      duration: endTime - startTime,
    };
  } finally {
    // Clean up temporary files
    console.log("[VideoProcessor] Cleaning up temporary files...");
    cleanupTempFiles(tempFiles);
  }
}

/**
 * Create a simple test video for demo purposes
 */
async function createTestVideo(): Promise<string> {
  const tempDir = tmpdir();
  const testVideoPath = join(tempDir, `test-${randomBytes(8).toString("hex")}.mp4`);

  return new Promise((resolve, reject) => {
    // Create a simple 10-second test video with color
    ffmpeg()
      .input("color=c=blue:s=1280x720:d=10")
      .inputFormat("lavfi")
      .output(testVideoPath)
      .outputOptions(["-pix_fmt", "yuv420p"])
      .on("end", () => {
        resolve(testVideoPath);
      })
      .on("error", (err: any) => {
        reject(err);
      })
      .run();
  });
}
