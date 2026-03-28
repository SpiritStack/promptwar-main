"use client";

import { useState, useRef, useCallback } from "react";

interface CameraCaptureProps {
  onImagesSelected: (files: File[]) => void;
  maxImages?: number;
}

export default function CameraCapture({
  onImagesSelected,
  maxImages = 20,
}: CameraCaptureProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      const totalFiles = [...selectedFiles, ...fileArray].slice(0, maxImages);

      setSelectedFiles(totalFiles);
      onImagesSelected(totalFiles);

      // Generate previews
      const newPreviews: string[] = [];
      totalFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string);
          if (newPreviews.length === totalFiles.length) {
            setPreviews([...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [selectedFiles, maxImages, onImagesSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    onImagesSelected(newFiles);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        className={`dropzone ${isDragOver ? "drag-over" : ""} ${selectedFiles.length > 0 ? "has-files" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload medication images"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
      >
        <div className="flex flex-col items-center gap-3">
          {selectedFiles.length === 0 ? (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(99, 102, 241, 0.1)" }}>
                <svg
                  className="w-8 h-8"
                  style={{ color: "var(--accent-primary-light)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <div>
                <p className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
                  Drop medication images here
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  or click to browse · Up to {maxImages} images
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(16, 185, 129, 0.1)" }}>
                <svg
                  className="w-6 h-6"
                  style={{ color: "var(--severity-safe)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--severity-safe)" }}>
                {selectedFiles.length} image{selectedFiles.length !== 1 ? "s" : ""} selected
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Click to add more
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          className="btn-secondary flex-1"
          onClick={() => cameraInputRef.current?.click()}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
          Take Photo
        </button>
        <button
          type="button"
          className="btn-secondary flex-1"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6.75v10.5A2.25 2.25 0 003.75 21z" />
          </svg>
          Browse Files
        </button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />

      {/* Image previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {previews.map((preview, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--border-subtle)" }}>
              <img
                src={preview}
                alt={`Medication image ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(239, 68, 68, 0.9)", color: "white" }}
                aria-label={`Remove image ${i + 1}`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
