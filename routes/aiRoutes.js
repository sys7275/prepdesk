import express from "express";
import multer from "multer";
import {
  generateBilingualMCQs,
  analyzeTestAttempt,
  extractMCQsFromPdf,
} from "../services/aiService.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB max PDF
});

// Simple in-memory rate limiter (for production multi-instance, use Redis)
const rateStore = new Map();
const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT) || 25;

function aiRateLimiter(req, res, next) {
  const clientKey = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const now = Date.now();
  const windowMs = 24 * 60 * 60 * 1000;

  const entry = rateStore.get(clientKey);
  if (!entry || now - entry.windowStart > windowMs) {
    rateStore.set(clientKey, { count: 1, windowStart: now });
    return next();
  }

  if (entry.count >= DAILY_LIMIT) {
    return res.status(429).json({
      success: false,
      message: `Daily AI request limit (${DAILY_LIMIT}) reached. Please try again later.`,
    });
  }

  entry.count += 1;
  next();
}

export function calculateExamScore({ category = "", correct = 0, wrong = 0, totalQuestions = 0 }) {
  const cat = String(category).toLowerCase();
  const marksPerQuestion = cat === "ssc" ? 2 : 1; // Matches TestPage logic

  let negativeMarks = 0;
  if (cat === "ssc") {
    negativeMarks = wrong * 0.5;
  } else if (cat === "upsssc") {
    negativeMarks = wrong * 0.25;
  } else if (cat === "railway") {
    negativeMarks = wrong / 3;
  }

  const rawScore = correct * marksPerQuestion - negativeMarks;
  const score = Number(rawScore.toFixed(2));
  const maximumMarks = totalQuestions * marksPerQuestion;
  const percentage = maximumMarks > 0 ? Number(((score / maximumMarks) * 100).toFixed(2)) : 0;

  return { score, maximumMarks, percentage, negativeMarks: Number(negativeMarks.toFixed(2)) };
}

router.post("/generate-questions", aiRateLimiter, async (req, res) => {
  try {
    const { topic, sourceText, count, difficulty, examCategory, examName, year, set, subject } =
      req.body || {};

    if (!topic && !sourceText) {
      return res.status(400).json({
        success: false,
        message: "Please provide either a topic or sourceText/syllabus.",
      });
    }

    const result = await generateBilingualMCQs({
      topic,
      sourceText,
      count,
      difficulty,
      examCategory,
      examName,
      year,
      set,
      subject,
    });

    return res.status(200).json({
      success: true,
      count: result.questions.length,
      cached: result.cached,
      questions: result.questions,
    });
  } catch (err) {
    console.error("AI GENERATE QUESTIONS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to generate AI questions.",
    });
  }
});

router.post("/extract-pdf", aiRateLimiter, upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a PDF file." });
    }

    const { examCategory, examName, year, set, subject } = req.body || {};
    const pdfBase64 = req.file.buffer.toString("base64");

    const questions = await extractMCQsFromPdf({
      pdfBase64,
      examCategory,
      examName,
      year,
      set,
      subject,
    });

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (err) {
    console.error("AI PDF EXTRACT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to extract questions from PDF.",
    });
  }
});

router.post("/analyze-attempt", aiRateLimiter, async (req, res) => {
  try {
    const {
      category = "",
      exam = "",
      correct = 0,
      wrong = 0,
      unattempted = 0,
      totalQuestions = 0,
      questionBreakdown = [],
    } = req.body || {};

    const grading = calculateExamScore({ category, correct, wrong, totalQuestions });
    const stats = {
      correct: Number(correct) || 0,
      wrong: Number(wrong) || 0,
      unattempted: Number(unattempted) || 0,
      attempted: (Number(correct) || 0) + (Number(wrong) || 0),
      totalQuestions: Number(totalQuestions) || 0,
      ...grading,
    };

    const result = await analyzeTestAttempt({
      category,
      exam,
      stats,
      questionBreakdown,
    });

    return res.status(200).json({
      success: true,
      grading,
      cached: result.cached,
      fallback: Boolean(result.fallback),
      analysis: result.analysis,
    });
  } catch (err) {
    console.error("AI ANALYZE ATTEMPT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to analyze test attempt.",
    });
  }
});

export default router;