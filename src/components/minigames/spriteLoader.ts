/**
 * Preload an HTMLImageElement for HTML5 <canvas> drawing.
 * Always wraps the path with encodeURI(...) for spaces/special characters.
 */
export function loadCanvasSprite(path: string, onLoad?: () => void): HTMLImageElement {
  const img = new Image();
  if (onLoad) {
    img.onload = () => onLoad();
  }
  img.src = encodeURI(path);
  if (onLoad && img.complete && img.naturalWidth > 0) {
    onLoad();
  }
  return img;
}

export function isSpriteReady(img: HTMLImageElement | null | undefined): img is HTMLImageElement {
  return Boolean(img && img.complete && img.naturalWidth > 0);
}

export function getHiDPIDpr(): number {
  return Math.min(window.devicePixelRatio || 1, 2);
}

export function prepareHiDPIFrame(ctx: CanvasRenderingContext2D, dpr = getHiDPIDpr()): void {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
}

export function setupHiDPICanvas(
  canvas: HTMLCanvasElement,
  logicalWidth: number,
  logicalHeight: number,
): CanvasRenderingContext2D | null {
  const dpr = getHiDPIDpr();
  const targetW = Math.round(logicalWidth * dpr);
  const targetH = Math.round(logicalHeight * dpr);
  if (canvas.width !== targetW) canvas.width = targetW;
  if (canvas.height !== targetH) canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  prepareHiDPIFrame(ctx, dpr);
  return ctx;
}
