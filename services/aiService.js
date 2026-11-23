import crypto from "crypto";
import AiCache from "../models/AiCache.js";

export function buildCacheKey(prefix, data) {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
  return `${prefix}:${hash}`;
}

export async function getCachedResponse(cacheKey) {
  if (!cacheKey) return null;
  const doc = await AiCache.findOne({ cacheKey }).lean();
  return doc ? doc.payload : null;
}

export async function setCachedResponse(cacheKey, type, payload) {
  if (!cacheKey || !payload) return;
  await AiCache.findOneAndUpdate(
    { cacheKey },
    { cacheKey, type, payload, createdAt: new Date() },
    { upsert: true, new: true }
  );
}

function sanitizeQuestions(rawQuestions, defaults) {
  if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
    throw new Error("AI returned an empty or invalid questions array.");
  }

  return rawQuestions.map((q, idx) => {
    const enOptions = Array.isArray(q.enOptions) ? q.enOptions.slice(0, 4) : [];
    const hiOptions = Array.isArray(q.hiOptions) ? q.hiOptions.slice(0, 4) : [];

    if (!q.enQuestion || !q.hiQuestion || enOptions.length < 4 || hiOptions.length < 4) {
      throw new Error(`Invalid bilingual question structure at index ${idx}`);
    }

    const correctAnswer =
      Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer <= 3
        ? q.correctAnswer
        : 0;

    return {
      examCategory: defaults.examCategory || "general",
      examName: defaults.examName || "AI Practice Set",
      year: defaults.year || "2026",
      date: defaults.date || "",
      shift: defaults.shift || "",
      set: defaults.set || "AI-Set-1",
      questionNumber: Number(q.questionNumber) || idx + 1,
      enQuestion: String(q.enQuestion).trim(),
      hiQuestion: String(q.hiQuestion).trim(),
      enOptions: enOptions.map((opt) => String(opt).trim()),
      hiOptions: hiOptions.map((opt) => String(opt).trim()),
      correctAnswer,
      explanation: String(q.explanation || "").trim(),
      subject: String(q.subject || defaults.subject || "General Studies").trim(),
      questionType: "MCQ",
      imageUrl: "",
    };
  });
}

async function callGeminiStructured({ systemInstruction, prompt, responseSchema, retries = 2 }) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.35,
            responseMimeType: "application/json",
            responseSchema,
          },
        }),
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini HTTP ${res.status}: ${errText.slice(0, 200)}`);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error("Empty response from Gemini model.");
      }

      return JSON.parse(rawText);
    } catch (err) {
      clearTimeout(timeout);
      if (attempt === retries) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    }
  }
}

export async function generateBilingualMCQs({
  topic,
  sourceText = "",
  count = 10,
  difficulty = "Moderate",
  examCategory = "upsssc",
  examName = "PET",
  year = "2026",
  set = "AI-Set-1",
  subject = "General Awareness",
}) {
  const safeCount = Math.min(Math.max(Number(count) || 5, 1), 25);
  const trimmedSource = String(sourceText || "").slice(0, 12000);

  const cacheKey = buildCacheKey("mcq_gen", {
    topic,
    trimmedSource,
    safeCount,
    difficulty,
    examCategory,
    subject,
  });

  const cached = await getCachedResponse(cacheKey);
  if (cached) {
    return { questions: cached, cached: true };
  }

  const responseSchema = {
    type: "OBJECT",
    properties: {
      questions: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            questionNumber: { type: "INTEGER" },
            enQuestion: { type: "STRING" },
            hiQuestion: { type: "STRING" },
            enOptions: { type: "ARRAY", items: { type: "STRING" } },
            hiOptions: { type: "ARRAY", items: { type: "STRING" } },
            correctAnswer: { type: "INTEGER" },
            explanation: { type: "STRING" },
            subject: { type: "STRING" },
          },
          required: [
            "questionNumber",
            "enQuestion",
            "hiQuestion",
            "enOptions",
            "hiOptions",
            "correctAnswer",
            "explanation",
            "subject",
          ],
        },
      },
    },
    required: ["questions"],
  };


  const systemInstruction =
    "You are an expert Indian competitive exam question author (UPSSSC, SSC, Railway, GATE). Generate accurate, unambiguous bilingual MCQs in English and Hindi with exactly 4 options each and 0-based correctAnswer index (0 to 3).";

  const prompt = [
    `Generate ${safeCount} ${difficulty} level MCQs for exam category "${examCategory.toUpperCase()}" (${examName}).`,
    `Primary Topic / Subject: ${topic || subject}.`,
    trimmedSource ? `Reference Material / Syllabus:\n${trimmedSource}` : "",
    "Ensure Hindi translation is natural and accurate for exam aspirants.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const parsed = await callGeminiStructured({
    systemInstruction,
    prompt,
    responseSchema,
  });

  const validated = sanitizeQuestions(parsed.questions, {
    examCategory,
    examName,
    year,
    set,
    subject,
  });

  await setCachedResponse(cacheKey, "questions", validated);
  return { questions: validated, cached: false };
}

export async function analyzeTestAttempt({ category, exam, stats, questionBreakdown = [] }) {
  const safeBreakdown = Array.isArray(questionBreakdown) ? questionBreakdown.slice(0, 100) : [];

  const cacheKey = buildCacheKey("attempt_analysis", {
    category,
    exam,
    stats,
    safeBreakdown,
  });

  const cached = await getCachedResponse(cacheKey);
  if (cached) {
    return { analysis: cached, cached: true };
  }

  const responseSchema = {
    type: "OBJECT",
    properties: {
      readinessLevel: { type: "STRING" },
      summary: { type: "STRING" },
      weakTopics: { type: "ARRAY", items: { type: "STRING" } },
      strongTopics: { type: "ARRAY", items: { type: "STRING" } },
      accuracyAdvice: { type: "STRING" },
      next48HourPlan: { type: "ARRAY", items: { type: "STRING" } },
    },
    required: [
      "readinessLevel",
      "summary",
      "weakTopics",
      "strongTopics",
      "accuracyAdvice",
      "next48HourPlan",
    ],
  };

  const systemInstruction =
    "You are a competitive exam performance coach. Analyze student test accuracy, negative marking losses, and topic mistakes, then provide concise, actionable guidance.";

  const prompt = [
    `Exam: ${String(category || "").toUpperCase()} - ${exam || "Mock Test"}`,
    `Stats: ${JSON.stringify(stats)}`,
    `Mistakes / Sample Breakdown: ${JSON.stringify(safeBreakdown.slice(0, 25))}`,
  ].join("\n");

  try {
    const analysis = await callGeminiStructured({
      systemInstruction,
      prompt,
      responseSchema,
      retries: 1,
    });

    await setCachedResponse(cacheKey, "analysis", analysis);
    return { analysis, cached: false };
  } catch {
    return {
      analysis: {
        readinessLevel: "Needs Revision",
        summary: "Your score and accuracy metrics are recorded. Focus on reducing negative marking on uncertain questions.",
        weakTopics: ["High-error questions from this attempt"],
        strongTopics: ["Attempted accurate questions"],
        accuracyAdvice: "Avoid guessing when elimination is not possible, especially under negative marking.",
        next48HourPlan: [
          "Review all wrong and marked-for-review questions.",
          "Practice 25 targeted MCQs on weak areas.",
          "Take one timed drill and track accuracy over raw attempts.",
        ],
      },
      cached: false,
      fallback: true,
    };
  }
}
export async function extractMCQsFromPdf({
  pdfBase64,
  examCategory = "upsssc",
  examName = "PET",
  year = "2026",
  set = "Set-1",
  subject = "General Awareness",
}) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  const primaryModel = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
  const candidateModels = Array.from(new Set([primaryModel, "gemini-3.8-flash"]));

  const responseSchema = {
    type: "OBJECT",
    properties: {
      questions: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            questionNumber: { type: "INTEGER" },
            enQuestion: { type: "STRING" },
            hiQuestion: { type: "STRING" },
            enOptions: { type: "ARRAY", items: { type: "STRING" } },
            hiOptions: { type: "ARRAY", items: { type: "STRING" } },
            correctAnswer: { type: "INTEGER" },
            explanation: { type: "STRING" },
            subject: { type: "STRING" },
          },
          required: [
            "questionNumber",
            "enQuestion",
            "hiQuestion",
            "enOptions",
            "hiOptions",
            "correctAnswer",
            "explanation",
            "subject",
          ],
        },
      },
    },
    required: ["questions"],
  };

  let lastError = null;

  for (const model of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    for (let attempt = 0; attempt <= 1; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000);

        let res;
        try {
          res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              systemInstruction: {
                parts: [
                  {
                    text: "You are an expert Indian competitive exam digitizer. Extract all MCQs accurately from the attached PDF. If the PDF is only in English or only in Hindi, provide accurate translations for the missing language so every question is complete in both English and Hindi with 4 options each and a 0-based correctAnswer index (0 to 3).",
                  },
                ],
              },
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      inlineData: {
                        mimeType: "application/pdf",
                        data: pdfBase64,
                      },
                    },
                    {
                      text: `Extract all exam questions from this PDF for ${examCategory.toUpperCase()} (${examName}). Return clean structured JSON.`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json",
                responseSchema,
              },
            }),
          });
        } finally {
          clearTimeout(timeout);
        }

        if (!res.ok) {
          const errText = await res.text();
          const err = new Error(
            `Gemini PDF Extract (${model}) HTTP ${res.status}: ${errText.slice(0, 200)}`
          );
          err.status = res.status;
          throw err;
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          throw new Error(`Empty response while extracting PDF questions using ${model}.`);
        }

        const parsed = JSON.parse(rawText);
        return sanitizeQuestions(parsed.questions, {
          examCategory,
          examName,
          year,
          set,
          subject,
        });
      } catch (err) {
        lastError = err;
        const retryable =
          err.status === 503 ||
          err.status === 429 ||
          err.status === 500 ||
          err.name === "AbortError" ||
          String(err.message).includes("503") ||
          String(err.message).includes("fetch failed");

        if (attempt === 1 || !retryable) {
          break; // Agle fallback model par move karein
        }
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error("Failed to extract questions from PDF across all models.");
}