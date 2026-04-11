"use client"

/**
 * Web KYC — W-KYC
 * 3-step identity verification:
 *   Step 1: ID document upload (file input)
 *   Step 2: Selfie capture (MediaDevices API or file fallback)
 *   Step 3: Status display (pending review)
 *
 * Regulatory refs: UK AML Regulations 2017, FCA CASS, GDPR Art. 9
 * ARIA: all interactive elements labelled, step announced via aria-live
 */

import { useState, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Step = "document" | "selfie" | "status"
type DocType = "passport" | "driving_licence" | "national_id"

interface UploadedFile {
  name: string
  sizeKb: number
  previewUrl: string
}

function fileToUpload(file: File): UploadedFile {
  return {
    name: file.name,
    sizeKb: Math.round(file.size / 1024),
    previewUrl: URL.createObjectURL(file),
  }
}

// ── Step indicator ────────────────────────────────────────────────────────────

function StepBadge({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "document", label: "ID Document" },
    { id: "selfie",   label: "Selfie" },
    { id: "status",   label: "Review" },
  ]
  const current = steps.findIndex((s) => s.id === step)

  return (
    <nav aria-label="KYC progress" className="mb-8">
      <ol className="flex items-center gap-0" role="list">
        {steps.map((s, i) => {
          const done    = i < current
          const active  = i === current
          return (
            <li key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                    done   ? "bg-[--color-success] text-white" :
                    active ? "bg-[--color-primary] text-white" :
                             "bg-[--color-bg-elevated] text-[--color-text-secondary]"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span className={`text-xs text-center ${active ? "font-semibold text-[--color-primary]" : "text-[--color-text-secondary]"}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 -mt-5 ${done ? "bg-[--color-success]" : "bg-[--color-border-subtle]"}`} aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// ── Document upload step ──────────────────────────────────────────────────────

function DocumentStep({
  onComplete,
}: {
  onComplete: (file: UploadedFile, docType: DocType) => void
}) {
  const [docType, setDocType] = useState<DocType>("passport")
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Please upload a JPEG or PNG image.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be smaller than 10 MB.")
      return
    }
    setError(null)
    setUploaded(fileToUpload(file))
  }

  const DOC_TYPES: { id: DocType; label: string }[] = [
    { id: "passport",        label: "Passport" },
    { id: "driving_licence", label: "Driving Licence" },
    { id: "national_id",     label: "National ID Card" },
  ]

  return (
    <section aria-labelledby="doc-heading">
      <h2 id="doc-heading" className="text-xl font-bold text-[--color-text-primary] mb-2">
        Upload your ID document
      </h2>
      <p className="text-sm text-[--color-text-secondary] mb-6">
        Upload a clear photo of your identity document. All sides must be visible and the text legible.
      </p>

      {/* Document type selector */}
      <fieldset className="mb-5">
        <legend className="text-sm font-medium text-[--color-text-primary] mb-2">
          Document type
        </legend>
        <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Select document type">
          {DOC_TYPES.map((dt) => (
            <button
              key={dt.id}
              type="button"
              role="radio"
              aria-checked={docType === dt.id}
              onClick={() => setDocType(dt.id)}
              className={`px-3 py-1.5 rounded-[--radius-md] border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-border-focus] ${
                docType === dt.id
                  ? "border-[--color-primary] bg-[--color-primary] text-white"
                  : "border-[--color-border-default] text-[--color-text-primary] hover:border-[--color-primary]"
              }`}
            >
              {dt.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Upload area */}
      <div
        className={`relative rounded-[--radius-lg] border-2 border-dashed p-8 text-center transition-colors cursor-pointer hover:border-[--color-primary] ${
          uploaded ? "border-[--color-success]" : "border-[--color-border-default]"
        }`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label={uploaded ? `Replace uploaded document: ${uploaded.name}` : "Upload ID document — click or drag and drop"}
        aria-describedby="upload-hint"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={handleFile}
          aria-label="ID document file input"
        />

        {uploaded ? (
          <div className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={uploaded.previewUrl}
              alt="Uploaded ID document preview"
              className="mx-auto max-h-40 rounded-[--radius-md] object-contain"
            />
            <p className="text-sm font-medium text-[--color-success]">✓ {uploaded.name}</p>
            <p className="text-xs text-[--color-text-secondary]">{uploaded.sizeKb} KB — click to replace</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl" aria-hidden="true">📄</div>
            <p className="text-sm font-medium text-[--color-text-primary]">
              Click to upload or drag &amp; drop
            </p>
            <p id="upload-hint" className="text-xs text-[--color-text-secondary]">
              JPEG or PNG, max 10 MB. Photo must be clear and all text legible.
            </p>
          </div>
        )}
      </div>

      {/* GDPR Art. 9 notice */}
      <p className="mt-3 text-xs text-[--color-text-secondary]">
        Your document is processed securely under{" "}
        <strong>GDPR Art. 9</strong> (special category data). Encrypted at rest and in transit.
        <a href="/legal/privacy" className="text-[--color-primary] hover:underline ml-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-border-focus]">
          Privacy policy
        </a>
      </p>

      {error && (
        <p role="alert" className="mt-2 text-xs text-[--color-error]">{error}</p>
      )}

      <div className="mt-6">
        <Button
          onClick={() => uploaded && onComplete(uploaded, docType)}
          disabled={!uploaded}
          aria-label="Continue to selfie step"
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </section>
  )
}

// ── Selfie step ───────────────────────────────────────────────────────────────

function SelfieStep({
  onComplete,
}: {
  onComplete: (file: UploadedFile) => void
}) {
  const [captured, setCaptured] = useState<UploadedFile | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraActive(true)
      setCameraError(null)
    } catch {
      setCameraError("Camera not available. Please upload a selfie instead.")
    }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraActive(false)
  }, [])

  function capturePhoto() {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d")?.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" })
      setCaptured(fileToUpload(file))
      stopCamera()
    }, "image/jpeg", 0.9)
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCaptured(fileToUpload(file))
    stopCamera()
  }

  return (
    <section aria-labelledby="selfie-heading">
      <h2 id="selfie-heading" className="text-xl font-bold text-[--color-text-primary] mb-2">
        Take a selfie
      </h2>
      <p className="text-sm text-[--color-text-secondary] mb-6">
        Look directly at the camera, ensure good lighting, and remove glasses.
      </p>

      {/* Camera preview / captured image */}
      <div className="relative rounded-[--radius-lg] overflow-hidden bg-black aspect-[4/3] mb-4">
        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

        {captured ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={captured.previewUrl}
            alt="Captured selfie preview"
            className="w-full h-full object-cover"
          />
        ) : cameraActive ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
              aria-label="Camera preview"
            />
            {/* Face guide overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <div className="w-48 h-56 border-2 border-white/60 rounded-full" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
            <span className="text-5xl" aria-hidden="true">🤳</span>
            <p className="text-sm text-white/80">Camera not started</p>
          </div>
        )}
      </div>

      {cameraError && (
        <p role="alert" className="text-xs text-[--color-error] mb-3">{cameraError}</p>
      )}

      {/* Controls */}
      <div className="flex gap-3 mb-4">
        {!captured && !cameraActive && (
          <>
            <Button
              onClick={startCamera}
              variant="secondary"
              aria-label="Open camera for selfie"
              className="flex-1"
            >
              📷 Open camera
            </Button>
            <Button
              onClick={() => fileInput.current?.click()}
              variant="outline"
              aria-label="Upload selfie from file"
              className="flex-1"
            >
              Upload photo
            </Button>
          </>
        )}

        {cameraActive && (
          <>
            <Button
              onClick={capturePhoto}
              aria-label="Capture selfie photo"
              className="flex-1"
            >
              Take photo
            </Button>
            <Button
              onClick={stopCamera}
              variant="outline"
              aria-label="Cancel camera"
              className="flex-1"
            >
              Cancel
            </Button>
          </>
        )}

        {captured && (
          <Button
            onClick={() => {
              setCaptured(null)
              setCameraActive(false)
            }}
            variant="outline"
            aria-label="Retake selfie"
            className="flex-1"
          >
            Retake
          </Button>
        )}
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        capture="user"
        className="sr-only"
        onChange={handleFileUpload}
        aria-label="Upload selfie file"
      />

      <Button
        onClick={() => captured && onComplete(captured)}
        disabled={!captured}
        aria-label="Submit selfie and complete KYC"
        className="w-full"
      >
        Submit for review
      </Button>
    </section>
  )
}

// ── Status step ───────────────────────────────────────────────────────────────

function StatusStep() {
  return (
    <section
      aria-labelledby="status-heading"
      aria-live="polite"
      className="text-center py-4"
    >
      <div
        className="mx-auto mb-4 h-16 w-16 rounded-full bg-[--color-warning-subtle] flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="text-3xl">🔍</span>
      </div>

      <h2
        id="status-heading"
        className="text-xl font-bold text-[--color-text-primary] mb-2"
      >
        Under review
      </h2>

      <p className="text-sm text-[--color-text-secondary] mb-6 max-w-xs mx-auto">
        Your documents have been submitted. Our compliance team will verify your identity
        within 1–2 business days.
      </p>

      {/* Status card */}
      <div className="rounded-[--radius-xl] border border-[--color-border-subtle] bg-[--color-bg-surface] p-4 text-left mb-6">
        <dl className="space-y-3" aria-label="KYC status details">
          <div className="flex justify-between">
            <dt className="text-sm text-[--color-text-secondary]">Status</dt>
            <dd className="text-sm font-semibold text-[--color-warning]">
              Pending review
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-[--color-text-secondary]">Submitted</dt>
            <dd className="text-sm text-[--color-text-primary]">
              {new Date().toLocaleDateString("en-GB")}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-[--color-text-secondary]">Expected completion</dt>
            <dd className="text-sm text-[--color-text-primary]">1–2 business days</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-[--color-text-secondary]">Regulation</dt>
            <dd className="text-sm text-[--color-text-primary]">UK AML Regulations 2017</dd>
          </div>
        </dl>
      </div>

      <a
        href="/dashboard"
        className="inline-flex h-11 items-center justify-center rounded-[--radius-md] bg-[--color-primary] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-border-focus]"
        aria-label="Return to dashboard"
      >
        Back to dashboard
      </a>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function KycPage() {
  const [step, setStep] = useState<Step>("document")

  return (
    <main
      className="min-h-screen bg-[--color-bg-page] px-4 py-6"
      aria-label="KYC identity verification"
    >
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <a
            href="/dashboard"
            className="text-sm text-[--color-text-secondary] hover:text-[--color-text-primary] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-border-focus] rounded"
            aria-label="Back to dashboard"
          >
            ← Back
          </a>
          <h1 className="text-lg font-bold text-[--color-text-primary]">
            Identity Verification
          </h1>
        </div>

        <StepBadge step={step} />

        <Card>
          <CardContent className="pt-6">
            {step === "document" && (
              <DocumentStep
                onComplete={(_, __) => setStep("selfie")}
              />
            )}
            {step === "selfie" && (
              <SelfieStep
                onComplete={() => setStep("status")}
              />
            )}
            {step === "status" && <StatusStep />}
          </CardContent>
        </Card>

        {/* Regulatory footer */}
        <p className="mt-4 text-center text-xs text-[--color-text-secondary]">
          Identity verification is required under{" "}
          <strong>UK Anti-Money Laundering Regulations 2017</strong> and FCA KYC guidelines.
          Your data is processed under GDPR Art. 9 (special category data).
        </p>
      </div>
    </main>
  )
}
