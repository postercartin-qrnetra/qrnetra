"use client";

import { resolveScanDestinationAction } from "@/app/actions/resolve-scan";
import jsQR from "jsqr";
import { Camera, LoaderCircle, ScanLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type ScannerState = "idle" | "starting" | "ready" | "resolving" | "error";

declare global {
  interface Window {
    BarcodeDetector?: {
      new (options?: { formats?: string[] }): {
        detect: (
          source: HTMLVideoElement | ImageBitmapSource,
        ) => Promise<Array<{ rawValue?: string }>>;
      };
      getSupportedFormats?: () => Promise<string[]>;
    };
  }
}

function isBarcodeDetectorSupported() {
  return typeof window !== "undefined" && "BarcodeDetector" in window;
}

export function ScanPageClient() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const resolvingRef = useRef(false);

  const [scannerState, setScannerState] = useState<ScannerState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [manualValue, setManualValue] = useState("");
  const [cameraSupported, setCameraSupported] = useState(true);

  const stopScanner = useCallback(() => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const handleResolvedValue = useCallback(async (rawValue: string) => {
    if (resolvingRef.current) return;

    resolvingRef.current = true;
    stopScanner();
    setScannerState("resolving");
    setError(null);

    const result = await resolveScanDestinationAction(rawValue);
    if (result.error || !result.destination) {
      resolvingRef.current = false;
      setScannerState("error");
      setError(result.error ?? "We could not resolve this QR.");
      return;
    }

    router.push(result.destination);
  }, [router, stopScanner]);

  useEffect(() => {
    let cancelled = false;

    async function startScanner() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraSupported(false);
        setScannerState("error");
        setError("Camera access is not supported on this device.");
        return;
      }

      try {
        setScannerState("starting");
        setError(null);

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();
        setScannerState("ready");

        const detector =
          isBarcodeDetectorSupported() && window.BarcodeDetector
            ? new window.BarcodeDetector({ formats: ["qr_code"] })
            : null;

        const tick = async () => {
          if (cancelled || resolvingRef.current) return;

          const currentVideo = videoRef.current;
          if (!currentVideo || currentVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
            frameRef.current = window.requestAnimationFrame(() => {
              void tick();
            });
            return;
          }

          try {
            let rawValue: string | null = null;

            if (detector) {
              const codes = await detector.detect(currentVideo);
              rawValue = codes[0]?.rawValue?.trim() ?? null;
            } else {
              const canvas = canvasRef.current;
              const context = canvas?.getContext("2d", { willReadFrequently: true });

              if (canvas && context) {
                const width = currentVideo.videoWidth;
                const height = currentVideo.videoHeight;

                if (width > 0 && height > 0) {
                  canvas.width = width;
                  canvas.height = height;
                  context.drawImage(currentVideo, 0, 0, width, height);
                  const imageData = context.getImageData(0, 0, width, height);
                  const result = jsQR(imageData.data, imageData.width, imageData.height);
                  rawValue = result?.data?.trim() ?? null;
                }
              }
            }

            if (rawValue) {
              await handleResolvedValue(rawValue);
              return;
            }
          } catch {
            // Ignore frame decode errors and keep scanning.
          }

          frameRef.current = window.requestAnimationFrame(() => {
            void tick();
          });
        };

        frameRef.current = window.requestAnimationFrame(() => {
          void tick();
        });
      } catch (scanError) {
        setScannerState("error");
        setError(
          scanError instanceof Error
            ? scanError.message
            : "Unable to start the camera scanner.",
        );
      }
    }

    void startScanner();

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [handleResolvedValue, router, stopScanner]);

  async function handleManualSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!manualValue.trim()) {
      setError("Paste a QRNetra scan URL or activation link to continue.");
      return;
    }

    await handleResolvedValue(manualValue);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-qn-accent">
          Scan QRNetra Tag
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Scan, resolve, and activate tags in one place
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-qn-muted sm:text-base">
          Existing owners can jump into tag management, new customers can activate
          physical stickers, and public finders can continue to the live QR page.
        </p>
      </div>

      <div className="qn-card mt-8 overflow-hidden p-4 sm:p-6">
        <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-black">
          <video
            ref={videoRef}
            className="aspect-[3/4] w-full object-cover sm:aspect-[4/3]"
            muted
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />

          <div className="pointer-events-none absolute inset-x-6 top-6 rounded-full bg-black/55 px-4 py-2 text-center text-xs font-semibold text-white backdrop-blur">
            Align the QR inside the camera frame
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-52 w-52 rounded-[28px] border border-qn-accent/50 shadow-[0_0_0_9999px_rgba(0,0,0,0.26)] sm:h-64 sm:w-64" />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/70 to-transparent px-4 pb-6 pt-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              {scannerState === "resolving" || scannerState === "starting" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <ScanLine className="h-4 w-4" />
              )}
              {scannerState === "starting" && "Starting camera…"}
              {scannerState === "resolving" && "Resolving QRNetra tag…"}
              {scannerState === "ready" && "Scanning live camera feed"}
              {scannerState === "error" && "Camera unavailable"}
              {scannerState === "idle" && "Preparing scanner…"}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-qn-card-2 p-4">
            <p className="text-sm font-semibold text-white">Tag owner</p>
            <p className="mt-2 text-sm text-qn-muted">
              Jump straight into your QR dashboard if this tag already belongs to
              you.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-qn-card-2 p-4">
            <p className="text-sm font-semibold text-white">New activation</p>
            <p className="mt-2 text-sm text-qn-muted">
              Activate purchased stickers by scanning the activation QR and
              completing a profile.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-qn-card-2 p-4">
            <p className="text-sm font-semibold text-white">Public contact</p>
            <p className="mt-2 text-sm text-qn-muted">
              Active public QR tags continue to the live contact page immediately.
            </p>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="mt-6 rounded-2xl border border-white/[0.08] bg-qn-card-2 p-4">
          <label className="block text-sm font-medium text-white">
            Paste a QRNetra URL manually
          </label>
          <p className="mt-1 text-xs text-qn-muted-2">
            Fallback for browsers without reliable camera scanning support.
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={manualValue}
              onChange={(event) => setManualValue(event.target.value)}
              placeholder="https://.../s/ABC123 or /activate?code=..."
              className="qn-input flex-1"
            />
            <button type="submit" className="qn-btn-primary sm:px-6">
              Continue
            </button>
          </div>
          {error ? (
            <p className="mt-3 text-sm text-qn-warning">{error}</p>
          ) : null}
          {!cameraSupported ? (
            <div className="mt-4 flex items-center gap-2 text-xs text-qn-muted-2">
              <Camera className="h-4 w-4" />
              Camera access is unavailable here, so the manual QRNetra URL flow is enabled.
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
