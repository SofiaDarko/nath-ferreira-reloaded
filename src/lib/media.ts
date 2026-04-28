// Media helpers — distinguish image vs video URLs and extract a poster frame
// from a video file in the browser.

export const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;

export function isVideo(url: string | null | undefined): boolean {
  if (!url) return false;
  return VIDEO_EXT.test(url);
}

/**
 * Capture a single frame from a video File and return it as a JPEG Blob.
 * Used to auto-generate a poster when the user uploads a video without
 * providing an explicit cover image.
 */
export function captureVideoPoster(file: File, atSec = 1): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.src = url;

    const cleanup = () => URL.revokeObjectURL(url);

    video.onloadedmetadata = () => {
      // Seek to a safe position (1s or 25% of duration, whichever is smaller)
      const target = Math.min(atSec, Math.max(0.1, (video.duration || 1) * 0.25));
      video.currentTime = target;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        const w = video.videoWidth || 1280;
        const h = video.videoHeight || 720;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          return reject(new Error('Canvas 2D context unavailable'));
        }
        ctx.drawImage(video, 0, 0, w, h);
        canvas.toBlob(
          (blob) => {
            cleanup();
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob failed'));
          },
          'image/jpeg',
          0.85
        );
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Failed to load video for poster capture'));
    };
  });
}
