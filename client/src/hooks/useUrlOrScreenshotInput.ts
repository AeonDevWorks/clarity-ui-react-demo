"use client";

import { useState } from "react";

export type InputSourceType = 'url' | 'screenshot' | 'html';

export interface FetchedData {
    sourceType: InputSourceType;
    snapshotKey: string;
    screenshotBase64: string | null;
    renderedHtml: string | null;
    title?: string;
}

export function useUrlOrScreenshotInput() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<FetchedData | null>(null);

  const fetchUrl = async (targetUrl: string) => {
    setIsLoading(true);
    setError(null);
    try {
        // MICROSERVICE_URL is likely http://localhost:8080 or Cloud Run URL
        const serviceUrl = process.env.NEXT_PUBLIC_MICROSERVICE_URL || 'http://localhost:8080';
        const res = await fetch(`${serviceUrl}/fetch?url=${encodeURIComponent(targetUrl)}`);
        
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.statusText}`);
        }

        const data = await res.json();
        setFetchedData({
            sourceType: 'url',
            snapshotKey: data.snapshot_key,
            screenshotBase64: data.screenshot_base64,
            renderedHtml: data.rendered_html,
            title: data.title
        });

    } catch (err: any) {
        setError(err.message || "Unknown error occurring fetch");
    } finally {
        setIsLoading(false);
    }
  };

  const uploadScreenshot = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
        const formData = new FormData();
        formData.append('screenshot', file);

        const serviceUrl = process.env.NEXT_PUBLIC_MICROSERVICE_URL || 'http://localhost:8080';
        const res = await fetch(`${serviceUrl}/upload_screenshot`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) throw new Error("Upload failed");
        
        const data = await res.json();
        setFetchedData({
             sourceType: 'screenshot',
             snapshotKey: data.snapshot_key,
             screenshotBase64: data.screenshot_base64,
             renderedHtml: null
        });

    } catch (err: any) {
         setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return {
    url,
    setUrl,
    isLoading,
    error,
    fetchedData,
    fetchUrl,
    uploadScreenshot
  };
}
