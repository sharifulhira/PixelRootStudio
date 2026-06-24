"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

type Props = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
  className?: string;
};

export function ImageUploader({
  value,
  onChange,
  folder = "misc",
  label = "Image",
  aspectRatio = "landscape",
  className = "",
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  const handleUpload = useCallback(async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }, [folder, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(file);
    } else {
      setError("Please drop an image file");
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setMode("upload");
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className={className}>
      <label className="block text-xs text-white/40 mb-2">{label}</label>
      
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            mode === "upload"
              ? "bg-amber-500 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            mode === "url"
              ? "bg-amber-500 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          Enter URL
        </button>
      </div>

      {mode === "url" ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
            className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Set
          </button>
        </div>
      ) : (
        <>
          {/* Upload Area */}
          {!value ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`
                relative ${aspectClasses[aspectRatio]} max-h-48 rounded-xl border-2 border-dashed 
                flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors
                ${dragActive 
                  ? "border-amber-500 bg-amber-500/10" 
                  : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10"
                }
                ${isUploading ? "pointer-events-none opacity-60" : ""}
              `}
            >
              {isUploading ? (
                <>
                  <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-white/60">Uploading...</span>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white/80">
                      <span className="text-amber-400 font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-white/40 mt-1">PNG, JPG, WebP up to 10MB</p>
                  </div>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            /* Preview */
            <div className="relative">
              <div className={`relative ${aspectClasses[aspectRatio]} max-h-64 rounded-xl overflow-hidden border border-white/10 bg-black`}>
                <Image
                  src={value}
                  alt="Uploaded image"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              
              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="p-2 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
                  title="Replace image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 rounded-lg bg-red-500/80 backdrop-blur-sm text-white hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              {/* Path display */}
              <p className="mt-2 text-xs text-white/40 truncate" title={value}>
                {value}
              </p>
              
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
