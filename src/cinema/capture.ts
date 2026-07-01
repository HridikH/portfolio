// Decode a short clip ONCE into an array of WebP-backed Image objects.
// After capture, scrubbing never touches the <video> again — it just picks a
// frame index and calls drawImage. Cached in IndexedDB keyed by url|width.
import { WEBP_QUALITY, captureWidth } from './assets';
import { idbGet, idbSet } from './idb';

export function hasFrameCallback(): boolean {
  return (
    typeof HTMLVideoElement !== 'undefined' &&
    'requestVideoFrameCallback' in HTMLVideoElement.prototype
  );
}

function blobsToImages(blobs: Blob[]): Promise<HTMLImageElement[]> {
  return Promise.all(
    blobs.map(
      (b) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          const url = URL.createObjectURL(b);
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = url;
        }),
    ),
  );
}

type RVFCVideo = HTMLVideoElement & {
  requestVideoFrameCallback: (cb: (now: number, meta: unknown) => void) => number;
};

/**
 * Play `url` through once (muted, hidden), export every decoded frame to a WebP
 * blob, and return the frames as Image objects. Returns [] on any failure so the
 * engine can fall back. Never persists a partial/stalled capture.
 */
export async function captureClip(url: string): Promise<HTMLImageElement[]> {
  if (!url || !hasFrameCallback()) return [];

  const video = document.createElement('video') as RVFCVideo;
  video.src = url;
  video.muted = true;
  video.playsInline = true;
  video.crossOrigin = 'anonymous';
  video.preload = 'auto';

  try {
    await new Promise<void>((res, rej) => {
      video.onloadedmetadata = () => res();
      video.onerror = () => rej(new Error('video load failed'));
    });
  } catch {
    return [];
  }

  const width = captureWidth(video.videoWidth || 1920);
  const cacheKey = `${url}|${width}`;

  const cached = await idbGet(cacheKey);
  if (cached && cached.length) {
    try {
      return await blobsToImages(cached);
    } catch {
      /* fall through to recapture */
    }
  }

  const height = Math.round((video.videoHeight / video.videoWidth) * width) || Math.round(width * 0.5625);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  const blobs: Blob[] = [];
  let completed = false;

  const captured = await new Promise<HTMLImageElement[]>((resolve) => {
    const onFrame = () => {
      ctx.drawImage(video, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) blobs.push(blob);
        },
        'image/webp',
        WEBP_QUALITY,
      );
      if (!completed) video.requestVideoFrameCallback(onFrame);
    };

    video.onended = async () => {
      completed = true;
      // give the last async toBlob a tick to land
      await new Promise((r) => setTimeout(r, 60));
      if (blobs.length > 3) {
        await idbSet(cacheKey, blobs); // only persist a complete capture
        try {
          resolve(await blobsToImages(blobs));
          return;
        } catch {
          /* fall through */
        }
      }
      resolve([]);
    };

    video.onerror = () => resolve([]);
    video.requestVideoFrameCallback(onFrame);
    video.play().catch(() => resolve([]));
  });

  return captured;
}
