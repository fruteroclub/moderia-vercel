import type { Transcript, Service } from "@prisma/client";

interface TranscriptWithRelations extends Transcript {
  service: Service;
}

interface TranscriptResponse {
  transcript?: TranscriptWithRelations | null;
  transcripts?: TranscriptWithRelations[] | null;
  error?: any;
  errorMessage?: string;
  metrics?: TranscriptMetrics | null;
}

interface TranscriptMetrics {
  [status: string]: number;
}

interface TranscriptCreateData {
  transcriptUrl?: string;
  content?: string;
  serviceId: string;
}

interface TranscriptUpdateData {
  transcriptUrl?: string;
  content?: string;
  status?: string;
}

/**
 * Creates a new transcript
 */
export async function createTranscriptRecord(
  data: TranscriptCreateData
): Promise<TranscriptResponse> {
  try {
    const res = await fetch("/api/transcripts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create transcript");
    const resData = await res.json();
    return { transcript: resData.transcript };
  } catch (error) {
    console.error("Error in createTranscriptRecord:", error);
    return {
      transcript: null,
      error,
      errorMessage: "Failed to create transcript",
    };
  }
}

/**
 * Fetches transcript by service
 */
export async function fetchServiceTranscript(
  serviceId: string
): Promise<TranscriptResponse> {
  try {
    const res = await fetch(`/api/transcripts/service/${serviceId}`);
    if (!res.ok) throw new Error("Failed to fetch transcript");
    const data = await res.json();
    return { transcript: data.transcript };
  } catch (error) {
    console.error("Error in fetchServiceTranscript:", error);
    return {
      transcript: null,
      error,
      errorMessage: "Failed to fetch transcript",
    };
  }
}

/**
 * Updates transcript status and content
 */
export async function updateTranscriptRecord(
  transcriptId: string,
  data: TranscriptUpdateData
): Promise<TranscriptResponse> {
  try {
    const res = await fetch(`/api/transcripts/${transcriptId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update transcript");
    const resData = await res.json();
    return { transcript: resData.transcript };
  } catch (error) {
    console.error("Error in updateTranscriptRecord:", error);
    return {
      transcript: null,
      error,
      errorMessage: "Failed to update transcript",
    };
  }
}

/**
 * Fetches transcripts by status
 */
export async function fetchTranscriptsByStatus(
  status: string
): Promise<TranscriptResponse> {
  try {
    const res = await fetch(`/api/transcripts/status/${status}`);
    if (!res.ok) throw new Error("Failed to fetch transcripts");
    const data = await res.json();
    return { transcripts: data.transcripts };
  } catch (error) {
    console.error("Error in fetchTranscriptsByStatus:", error);
    return {
      transcripts: null,
      error,
      errorMessage: "Failed to fetch transcripts",
    };
  }
}

/**
 * Fetches transcript metrics
 */
export async function fetchTranscriptMetrics(): Promise<TranscriptResponse> {
  try {
    const res = await fetch("/api/transcripts/metrics");
    if (!res.ok) throw new Error("Failed to fetch transcript metrics");
    const data = await res.json();
    return { metrics: data.metrics };
  } catch (error) {
    console.error("Error in fetchTranscriptMetrics:", error);
    return {
      metrics: null,
      error,
      errorMessage: "Failed to fetch transcript metrics",
    };
  }
}
