import { Anthropic } from "@anthropic-ai/sdk";

const anthropicClient = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

export interface SessionEvaluation {
  qualityRating: number;
  paymentDistribution: {
    mentor: number;
    mentee: number;
    agent: number;
    platform: number;
  };
  keyEvidence: {
    [key: string]: string;
  };
  justification: string;
}

export interface EvaluationInputs {
  transcript: string;
  duration: string;
  speakerBreakdown: {
    instructor: number;
    student: number;
  };
  engagementMetrics: {
    [key: string]: number | string;
  };
  qualityScore: number;
  sessionHighlights: string[];
  sessionConcerns: string[];
}

const buildEvaluationPrompt = (inputs: EvaluationInputs): string => {
  return `You are a session quality assessment system. Your task is to evaluate a tutoring session and return ONLY a JSON object in the exact format specified below.

Input Analysis:
Duration: ${inputs.duration}
Speaker Breakdown: Instructor ${inputs.speakerBreakdown.instructor}%, Student ${
    inputs.speakerBreakdown.student
  }%
Quality Score: ${inputs.qualityScore}/10

Engagement Metrics:
${Object.entries(inputs.engagementMetrics)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}

${
  inputs.sessionHighlights.length > 0
    ? `Session Highlights:\n${inputs.sessionHighlights
        .map((h) => `- ${h}`)
        .join("\n")}\n`
    : ""
}
${
  inputs.sessionConcerns.length > 0
    ? `Session Concerns:\n${inputs.sessionConcerns
        .map((c) => `- ${c}`)
        .join("\n")}\n`
    : ""
}

Transcript:
${inputs.transcript}

Rating Scale and Distribution:
5.0 ★★★★★ (Exceptional) = Mentor: 90%, Mentee: 5%, Agent: 2.5%, Platform: 2.5%
4.0 ★★★★☆ (Very Good) = Mentor: 70%, Mentee: 25%, Agent: 2.5%, Platform: 2.5%
3.0 ★★★☆☆ (Satisfactory) = Mentor: 50%, Mentee: 45%, Agent: 2.5%, Platform: 2.5%
2.0 ★★☆☆☆ (Substandard) = Mentor: 30%, Mentee: 65%, Agent: 2.5%, Platform: 2.5%
1.0 ★☆☆☆☆ (Poor) = Mentor: 10%, Mentee: 85%, Agent: 2.5%, Platform: 2.5%
0.0 ☆☆☆☆☆ (Unacceptable) = Mentor: 0%, Mentee: 90%, Agent: 5%, Platform: 5%

IMPORTANT: You must return ONLY a JSON object with the following requirements:

1. qualityRating: number between 0 and 5, with exactly one decimal place
2. paymentDistribution: object with exactly these numeric fields:
   - mentor: number (percentage)
   - mentee: number (percentage)
   - agent: number (always 2.5 for ratings 1-5, 5 for rating 0)
   - platform: number (always 2.5 for ratings 1-5, 5 for rating 0)
3. keyEvidence: object with exactly these string fields:
   - evidence1: string (quote or metric)
   - evidence2: string (quote or metric)
   - evidence3: string (quote or metric)
4. justification: string (exactly 480 words)

Return your evaluation in this exact format, with no additional text or explanation:

{
  "qualityRating": 0.0,
  "paymentDistribution": {
    "mentor": 0,
    "mentee": 0,
    "agent": 2.5,
    "platform": 2.5
  },
  "keyEvidence": {
    "evidence1": "First key evidence with quote or metric",
    "evidence2": "Second key evidence with quote or metric",
    "evidence3": "Third key evidence with quote or metric"
  },
  "justification": "Your 480-word justification here"
}

DO NOT include any other text, markdown, or explanation outside of this JSON structure.`;
};

export const evaluateSession = async (
  inputs: EvaluationInputs,
  setIsEvaluating?: React.Dispatch<React.SetStateAction<boolean>>
): Promise<SessionEvaluation> => {
  if (!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY) {
    throw new Error("Anthropic API key is not set");
  }
  if (setIsEvaluating) setIsEvaluating(true);

  try {
    const prompt = buildEvaluationPrompt(inputs);

    const message = await anthropicClient.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    if (!("text" in message.content[0])) {
      throw new Error("Unexpected response format from Claude");
    }

    const jsonMatch = message.content[0].text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Claude's response");
    }

    let parsedResponse: unknown;
    try {
      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (e) {
      throw new Error(
        `Failed to parse JSON response: ${
          e instanceof Error ? e.message : "Unknown error"
        }`
      );
    }

    // Type guard function to validate the response structure
    function isSessionEvaluation(obj: unknown): obj is SessionEvaluation {
      if (!obj || typeof obj !== "object") return false;

      const evaluation = obj as Partial<SessionEvaluation>;

      return (
        typeof evaluation.qualityRating === "number" &&
        evaluation.paymentDistribution !== undefined &&
        typeof evaluation.paymentDistribution === "object" &&
        typeof evaluation.paymentDistribution.mentor === "number" &&
        typeof evaluation.paymentDistribution.mentee === "number" &&
        typeof evaluation.paymentDistribution.agent === "number" &&
        typeof evaluation.paymentDistribution.platform === "number" &&
        evaluation.keyEvidence !== undefined &&
        typeof evaluation.keyEvidence === "object" &&
        Object.values(evaluation.keyEvidence).every(
          (v) => typeof v === "string"
        ) &&
        typeof evaluation.justification === "string"
      );
    }

    if (!isSessionEvaluation(parsedResponse)) {
      throw new Error(
        "Invalid evaluation format. Response does not match expected structure: " +
          JSON.stringify(parsedResponse, null, 2)
      );
    }

    // At this point, TypeScript knows parsedResponse is SessionEvaluation
    return parsedResponse;
  } catch (error) {
    console.error("Evaluation error:", error);
    throw error;
  } finally {
    if (setIsEvaluating) setIsEvaluating(false);
  }
};

export const formatEvaluationResult = (
  evaluation: SessionEvaluation
): string => {
  const stars =
    "★".repeat(Math.floor(evaluation.qualityRating)) +
    "☆".repeat(5 - Math.floor(evaluation.qualityRating));

  const evidenceList = Object.values(evaluation.keyEvidence)
    .map((evidence) => `- ${evidence}`)
    .join("\n");

  return `# Session Quality Assessment

## Rating: ${stars} (${evaluation.qualityRating.toFixed(1)}/5.0)

### Key Evidence
${evidenceList}

### Payment Distribution
- Mentor: ${evaluation.paymentDistribution.mentor}%
- Mentee: ${evaluation.paymentDistribution.mentee}%
- Agent: ${evaluation.paymentDistribution.agent}%
- Platform: ${evaluation.paymentDistribution.platform}%

### Detailed Analysis
${evaluation.justification}

### Resolution Timeline
Both parties have 3 days to approve this verdict. Once approved, the payment will be distributed according to the above percentages.`;
};
