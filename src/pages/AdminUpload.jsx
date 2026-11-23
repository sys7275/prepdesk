import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  FileText,
  Loader2,
  Sparkles,
  FileUp,
  ImagePlus,
} from "lucide-react";

import { petExam } from "../data/petData";
import { sscCgl } from "../data/sscCglData";
import { sscChsl } from "../data/sscChslData";

import { railwayGroupD } from "../data/railwayGroupDData";
import { railwayNtpc } from "../data/railwayNtpcData";
import { railwayAlp } from "../data/railwayAlpData";

import { gateCse } from "../data/gateCseData";

import { uptetExam } from "../data/uptetData";
import { superTetExam } from "../data/superTetData";
import { upTgtExam } from "../data/upTgtData";
import { upPgtExam } from "../data/upPgtData";

import { parsePastedQuestions } from "../utils/parsePastedQuestions";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const examDataMap = {
  "upsssc-pet": petExam,
  "ssc-cgl": sscCgl,
  "ssc-chsl": sscChsl,
  "railway-group-d": railwayGroupD,
  "railway-ntpc": railwayNtpc,
  "railway-alp": railwayAlp,
  "gate-cse": gateCse,
  "upessc-uptet": uptetExam,
  "upessc-super-tet": superTetExam,
  "upessc-tgt": upTgtExam,
  "upessc-pgt": upPgtExam,
};

const practiceSetOptions = Array.from({ length: 15 }, (_, idx) => String(idx + 1));

function AdminUpload() {
  const { category, exam, type, set } = useParams();

  const isPracticeRoute = type === "practice";
  const routePracticeSetNumber = Number(set);
  const examKey = `${category}-${exam}`;
  const examData = examDataMap[examKey];
  const examTitle = getExamTitle(category, exam);

  /* =======================================================
     STATES
  ======================================================= */
  const [uploadMode, setUploadMode] = useState(
    isPracticeRoute ? "practice" : "exam"
  );
  const [selectedPracticeSet, setSelectedPracticeSet] = useState(
    routePracticeSetNumber >= 1 && routePracticeSetNumber <= 15
      ? String(routePracticeSetNumber)
      : "1"
  );

  const effectivePracticeMode = isPracticeRoute || uploadMode === "practice";
  const practiceSetNumber = isPracticeRoute
    ? routePracticeSetNumber
    : Number(selectedPracticeSet);

  const [year, setYear] = useState("");
  const [tier, setTier] = useState("");
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [shift, setShift] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [setName, setSetName] = useState("");

  /* PDF UPLOAD STATES */
  const [pdfFile, setPdfFile] = useState(null);
  const [extractingPdf, setExtractingPdf] = useState(false);

  /* AI GENERATOR STATES */
  const [aiTopic, setAiTopic] = useState("");
  const [aiSourceText, setAiSourceText] = useState("");
  const [aiCount, setAiCount] = useState(10);
  const [aiDifficulty, setAiDifficulty] = useState("Moderate");
  const [generatingAi, setGeneratingAi] = useState(false);

  /* DIRECT PASTE STATES */
  const [rawQuestionsText, setRawQuestionsText] = useState("");
  const [pasteTargetLang, setPasteTargetLang] = useState("both");
  const [pasteError, setPasteError] = useState("");
  const [pasteSuccess, setPasteSuccess] = useState("");

  /* MULTI-SECTION DI / GRAPH IMAGE UPLOAD STATES */
  const [diImageSections, setDiImageSections] = useState([
    {
      id: 1,
      fromQ: "76",
      toQ: "80",
      imageUrl: "",
      fileName: "",
      uploading: false,
    },
  ]);

  /* QUESTIONS */
  const [englishQuestions, setEnglishQuestions] = useState([]);
  const [hindiQuestions, setHindiQuestions] = useState([]);

  /* ERROR & SUCCESS */
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedYear = examData?.years?.find(
    (item) => String(item.year) === String(year)
  );

  const isPET = category === "upsssc";
  const isSSC = category === "ssc";
  const isRailway = category === "railway";
  const isGate = category === "gate";
  const isUPESSC = category === "upessc";
  const isTGT = isUPESSC && exam === "tgt";

  const selectedTier = selectedYear?.tiers?.find((item) => item.name === tier);
  const selectedMonth = selectedYear?.months?.find(
    (item) => item.month === month
  );
  const selectedPetDate = selectedYear?.dates?.find(
    (item) => item.date === date
  );
  const selectedPetShift = selectedYear?.shifts?.find(
    (item) => item.name === shift
  );
  const selectedSscDate = selectedTier?.dates?.find(
    (item) => item.date === date
  );
  const selectedRailwayDate = selectedMonth?.dates?.find(
    (item) => item.date === date
  );
  const selectedUpesscDate = selectedYear?.dates?.find(
    (item) => item.date === date
  );
  const selectedSubjectObj = selectedYear?.subjects?.find(
    (item) => item.name === subjectName
  );

  const gateYear = selectedYear;

  let dates = [];
  if (isPET || isUPESSC) {
    dates = selectedYear?.dates?.map((item) => item.date) || [];
  }
  if (isSSC) {
    dates = selectedTier?.dates?.map((item) => item.date) || [];
  }
  if (isRailway) {
    dates = selectedMonth?.dates?.map((item) => item.date) || [];
  }

  let subjects = [];
  if (isTGT) {
    subjects = selectedYear?.subjects?.map((item) => item.name) || [];
  }

  let shifts = [];
  if (isPET) {
    if (selectedPetDate) {
      shifts = selectedPetDate.shifts || [];
    }
    if (selectedYear?.shifts) {
      shifts = selectedPetShift
        ? [selectedPetShift.name]
        : selectedYear.shifts.map((item) => item.name);
    }
  }
  if (isUPESSC) {
    if (selectedUpesscDate?.shifts) {
      shifts = selectedUpesscDate.shifts;
    } else if (selectedYear?.shifts) {
      shifts = selectedYear.shifts.map((item) => item.name);
    }
  }
  if (isSSC) {
    shifts = selectedSscDate?.shifts || [];
  }
  if (isRailway) {
    shifts = selectedRailwayDate?.shifts || [];
  }

  let sets = [];
  if (isTGT) {
    sets = selectedSubjectObj?.sets || ["Set-A", "Set-B", "Set-C", "Set-D"];
  } else if (isUPESSC) {
    sets = selectedUpesscDate?.sets || ["Set-A", "Set-B", "Set-C", "Set-D"];
  } else if (isPET) {
    if (selectedPetDate) {
      sets = selectedPetDate.sets || [];
    }
    if (selectedPetShift && !selectedPetDate) {
      sets = selectedPetShift.sets || [];
    }
  }
  if (isGate) {
    sets = gateYear?.sets || [];
  }

  const paperSelected = effectivePracticeMode
    ? practiceSetNumber >= 1 && practiceSetNumber <= 15
    : !!year &&
      (isGate
        ? !!setName
        : isTGT
          ? !!date && !!shift && !!subjectName && !!setName
          : isUPESSC
            ? !!date && !!shift && !!setName
            : isPET
              ? !!setName
              : isSSC
                ? !!tier && !!date && !!shift
                : isRailway
                  ? !!month && !!date && !!shift
                  : false);

  const handleYearChange = (value) => {
    setYear(value);
    setTier("");
    setMonth("");
    setDate("");
    setShift("");
    setSubjectName("");
    setSetName("");
    setPdfFile(null);
    setEnglishQuestions([]);
    setHindiQuestions([]);
    setError("");
    setSuccess("");
  };

  /* Helper: Sync all DI image sections onto loaded questions */
  const syncSectionsToQuestions = (sectionsList) => {
    const applyImages = (qList) =>
      qList.map((q, idx) => {
        const qNum = Number(q.questionNumber || idx + 1);
        let matchedUrl = "";

        for (const sec of sectionsList) {
          const start = Number(sec.fromQ);
          const end = Number(sec.toQ) || start;
          if (
            sec.imageUrl &&
            start >= 1 &&
            end >= start &&
            qNum >= start &&
            qNum <= end
          ) {
            matchedUrl = sec.imageUrl;
          }
        }

        return { ...q, imageUrl: matchedUrl };
      });

    setHindiQuestions(applyImages);
    setEnglishQuestions(applyImages);
  };

  /* Helper: Map backend extracted/generated array into English & Hindi queues */
  const applyBilingualQuestions = (rawList, fallbackSubject = "") => {
    const resolvedSubject =
      subjectName.trim() || rawList[0]?.subject || fallbackSubject;

    const mappedEn = rawList.map((q, idx) => ({
      questionNumber: q.questionNumber || idx + 1,
      question: { en: q.enQuestion },
      options: { en: q.enOptions },
      correctAnswer: q.correctAnswer,
      explanation: { en: q.explanation || "" },
      subject: resolvedSubject || q.subject || "",
      imageUrl: "",
    }));

    const mappedHi = rawList.map((q, idx) => ({
      questionNumber: q.questionNumber || idx + 1,
      question: { hi: q.hiQuestion },
      options: { hi: q.hiOptions },
      correctAnswer: q.correctAnswer,
      explanation: { hi: q.explanation || "" },
      subject: resolvedSubject || q.subject || "",
      imageUrl: "",
    }));

    setEnglishQuestions(mappedEn);
    setHindiQuestions(mappedHi);
    syncSectionsToQuestions(diImageSections);
  };

  /* =======================================================
     PDF EXTRACTOR (BILINGUAL MCQs FROM PDF)
  ======================================================= */
  const handleExtractFromPdf = async () => {
    if (!pdfFile) {
      setError("Please select a PDF file first.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setExtractingPdf(true);

      const resolvedSubject =
        subjectName.trim() || aiTopic.trim() || "General Studies";

      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("examCategory", category || "upsssc");
      formData.append("examName", examTitle);
      formData.append("year", effectivePracticeMode ? "0" : year || "2026");
      formData.append("date", effectivePracticeMode ? "" : date || "");
      formData.append("shift", effectivePracticeMode ? "" : shift || "");
      formData.append(
        "set",
        effectivePracticeMode
          ? `Set ${practiceSetNumber}`
          : setName || "Set-A"
      );
      formData.append("subject", resolvedSubject);

      const response = await fetch(`${API_BASE}/api/ai/extract-pdf`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success || !Array.isArray(data.questions)) {
        throw new Error(data.message || "Failed to extract questions from PDF.");
      }

      applyBilingualQuestions(data.questions, resolvedSubject);

      setSuccess(
        `✅ Extracted ${data.questions.length} bilingual questions from "${pdfFile.name}". Review, validate, and click "Save to Database".`
      );
    } catch (err) {
      console.error("PDF EXTRACT ERROR:", err);
      setEnglishQuestions([]);
      setHindiQuestions([]);
      setError(err.message || "Failed to extract questions from PDF.");
    } finally {
      setExtractingPdf(false);
    }
  };

  /* =======================================================
     AI BILINGUAL MCQ GENERATOR
  ======================================================= */
  const handleGenerateWithAi = async () => {
    if (!aiTopic.trim() && !aiSourceText.trim() && !subjectName.trim()) {
      setError("Please enter a topic or syllabus/reference text for AI generation.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setGeneratingAi(true);

      const resolvedSubject =
        subjectName.trim() || aiTopic.trim() || "General Studies";

      const response = await fetch(`${API_BASE}/api/ai/generate-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic.trim() || subjectName.trim(),
          sourceText: aiSourceText.trim(),
          count: Number(aiCount) || 10,
          difficulty: aiDifficulty,
          examCategory: category || "upsssc",
          examName: examTitle,
          year: effectivePracticeMode ? "0" : year || "2026",
          date: effectivePracticeMode ? "" : date || "",
          shift: effectivePracticeMode ? "" : shift || "",
          set: effectivePracticeMode
            ? `Set ${practiceSetNumber}`
            : setName || "AI-Set-A",
          subject: resolvedSubject,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !Array.isArray(data.questions)) {
        throw new Error(data.message || "AI failed to generate questions.");
      }

      applyBilingualQuestions(data.questions, resolvedSubject);

      setSuccess(
        `✨ AI generated ${data.questions.length} bilingual questions${
          data.cached ? " (from cache)" : ""
        }. Review, validate, and click "Save to Database".`
      );
    } catch (err) {
      console.error("AI GENERATE ERROR:", err);
      setError(err.message || "Failed to generate questions using AI.");
    } finally {
      setGeneratingAi(false);
    }
  };

  /* =======================================================
     DIRECT PASTE QUESTIONS (NO AI REQUIRED)
  ======================================================= */
  const handleLoadPastedQuestions = () => {
    setError("");
    setSuccess("");
    setPasteError("");
    setPasteSuccess("");

    try {
      const parsed = parsePastedQuestions(rawQuestionsText);
      if (!parsed.length) {
        setPasteError("No valid questions found. Check the format.");
        return;
      }

      const subjectLabel =
        subjectName.trim() || aiTopic.trim() || "General Studies";

      const applyImages = (qList) =>
        qList.map((q) => {
          const qNum = Number(q.questionNumber);
          let matchedUrl = "";
          for (const sec of diImageSections) {
            const start = Number(sec.fromQ);
            const end = Number(sec.toQ) || start;
            if (
              sec.imageUrl &&
              start >= 1 &&
              end >= start &&
              qNum >= start &&
              qNum <= end
            ) {
              matchedUrl = sec.imageUrl;
            }
          }
          return { ...q, imageUrl: matchedUrl };
        });

      const mappedEn = applyImages(
        parsed.map((q, idx) => ({
          questionNumber: q.questionNumber || idx + 1,
          question: { en: q.question },
          options: { en: q.options.map((opt) => opt.text) },
          correctAnswer: q.correctAnswer,
          explanation: { en: q.explanation || "" },
          subject: subjectLabel,
          imageUrl: "",
        }))
      );

      const mappedHi = applyImages(
        parsed.map((q, idx) => ({
          questionNumber: q.questionNumber || idx + 1,
          question: { hi: q.question },
          options: { hi: q.options.map((opt) => opt.text) },
          correctAnswer: q.correctAnswer,
          explanation: { hi: q.explanation || "" },
          subject: subjectLabel,
          imageUrl: "",
        }))
      );

      if (effectivePracticeMode || pasteTargetLang === "hi") {
        setHindiQuestions(mappedHi);
      } else if (pasteTargetLang === "en") {
        setEnglishQuestions(mappedEn);
      } else {
        setEnglishQuestions(mappedEn);
        setHindiQuestions(mappedHi);
      }

      setPasteSuccess(
        `Loaded ${parsed.length} pasted questions into the set (${subjectLabel}). Click "Validate Questions" or "Save to Database".`
      );
    } catch (err) {
      setPasteError(err.message || "Failed to parse pasted questions.");
    }
  };

  /* =======================================================
     MULTI-SECTION DI / GRAPH IMAGE HANDLERS
  ======================================================= */
  const handleAddDiSection = () => {
    setDiImageSections((prev) => {
      const last = prev[prev.length - 1];
      const lastEnd = Number(last?.toQ) || 80;
      const span =
        last && Number(last.toQ) >= Number(last.fromQ)
          ? Number(last.toQ) - Number(last.fromQ)
          : 4;

      const nextFrom = lastEnd + 1;
      const nextTo = nextFrom + span;

      return [
        ...prev,
        {
          id: Date.now() + Math.random(),
          fromQ: String(nextFrom),
          toQ: String(nextTo),
          imageUrl: "",
          fileName: "",
          uploading: false,
        },
      ];
    });
  };

  const handleRemoveDiSection = (sectionId) => {
    setDiImageSections((prev) => {
      const filtered =
        prev.length > 1 ? prev.filter((item) => item.id !== sectionId) : prev;
      syncSectionsToQuestions(filtered);
      return filtered;
    });
  };

  const handleDiSectionRangeChange = (sectionId, field, value) => {
    setDiImageSections((prev) => {
      const updated = prev.map((item) =>
        item.id === sectionId ? { ...item, [field]: value } : item
      );
      syncSectionsToQuestions(updated);
      return updated;
    });
  };

  const handleDiSectionImageUpload = async (sectionId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetSection = diImageSections.find((s) => s.id === sectionId);
    const startQ = Number(targetSection?.fromQ);
    const endQ = Number(targetSection?.toQ) || startQ;

    if (!startQ || startQ < 1 || endQ < startQ) {
      setError(
        "Please enter a valid Question Range (e.g., 76 to 80) before uploading."
      );
      e.target.value = "";
      return;
    }

    try {
      setError("");
      setDiImageSections((prev) =>
        prev.map((item) =>
          item.id === sectionId ? { ...item, uploading: true } : item
        )
      );

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_BASE}/api/upload/image`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success || !data.imageUrl) {
        throw new Error(data.message || "Failed to upload DI/graph image.");
      }

      const fullUrl = `${API_BASE}${data.imageUrl}`;

      setDiImageSections((prev) => {
        const updated = prev.map((item) =>
          item.id === sectionId
            ? {
                ...item,
                imageUrl: fullUrl,
                fileName: file.name,
                uploading: false,
              }
            : item
        );

        syncSectionsToQuestions(updated);

        const isLast = updated[updated.length - 1]?.id === sectionId;
        if (isLast) {
          const span = endQ - startQ;
          const nextFrom = endQ + 1;
          const nextTo = nextFrom + span;
          return [
            ...updated,
            {
              id: Date.now() + Math.random(),
              fromQ: String(nextFrom),
              toQ: String(nextTo),
              imageUrl: "",
              fileName: "",
              uploading: false,
            },
          ];
        }

        return updated;
      });
    } catch (err) {
      setError(err.message || "Image upload error");
      setDiImageSections((prev) =>
        prev.map((item) =>
          item.id === sectionId ? { ...item, uploading: false } : item
        )
      );
    } finally {
      e.target.value = "";
    }
  };

  /* Helper: Post questions in batches so MongoDB/Express doesn't time out */
  const postQuestionsInBatches = async (questions) => {
    const batchSize = 25;
    let totalSaved = 0;

    for (let i = 0; i < questions.length; i += batchSize) {
      const batchIndex = Math.floor(i / batchSize);
      const chunk = questions.slice(i, i + batchSize);
      const response = await fetch(`${API_BASE}/api/questions/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: chunk,
          batchIndex,
        }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server returned non-JSON response: ${responseText.slice(0, 300)}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Failed to save questions (batch starting at Q${i + 1}).`
        );
      }

      totalSaved += Number(data.count ?? chunk.length);
    }

    return totalSaved;
  };

  /* =======================================================
     VALIDATE
  ======================================================= */
  const validateUpload = () => {
    setError("");
    setSuccess("");

    if (effectivePracticeMode) {
      if (practiceSetNumber < 1 || practiceSetNumber > 15) {
        setError("Practice Set must be between Set 1 and Set 15.");
        return;
      }

      if (hindiQuestions.length === 0) {
        setError("Hindi questions could not be extracted.");
        return;
      }

      for (let i = 0; i < hindiQuestions.length; i++) {
        const ans = normalizeCorrectAnswerIndex(hindiQuestions[i].correctAnswer);
        if (ans < 0 || ans > 4) {
          setError(`Invalid correct answer at Q${i + 1}.`);
          return;
        }
      }

      setSuccess(
        `Validation successful. ${hindiQuestions.length} Hindi questions are ready for Practice Set ${practiceSetNumber}.`
      );
      return;
    }

    if (!paperSelected) {
      setError("Please select the complete paper structure.");
      return;
    }

    if (englishQuestions.length === 0) {
      setError("English questions could not be extracted.");
      return;
    }

    if (hindiQuestions.length === 0) {
      setError("Hindi questions are not available.");
      return;
    }

    if (englishQuestions.length !== hindiQuestions.length) {
      setError(
        `Question count mismatch. English: ${englishQuestions.length}, Hindi: ${hindiQuestions.length}.`
      );
      return;
    }

    for (let i = 0; i < englishQuestions.length; i++) {
      const englishNumber = Number(englishQuestions[i].questionNumber);
      const hindiNumber = Number(hindiQuestions[i].questionNumber);

      if (englishNumber !== hindiNumber) {
        setError(
          `Question number mismatch at position ${i + 1}. English Q${englishNumber}, Hindi Q${hindiNumber}.`
        );
        return;
      }
    }

    for (let i = 0; i < englishQuestions.length; i++) {
      if (
        normalizeCorrectAnswerIndex(englishQuestions[i].correctAnswer) !==
        normalizeCorrectAnswerIndex(hindiQuestions[i].correctAnswer)
      ) {
        setError(`Correct answer mismatch at question ${i + 1}.`);
        return;
      }
    }

    setSuccess(
      `Validation successful. ${englishQuestions.length} English + ${hindiQuestions.length} Hindi questions are ready.`
    );
  };

  /* =======================================================
     SAVE TO DATABASE
  ======================================================= */
  const saveToDatabase = async () => {
    setError("");
    setSuccess("");

    const activeSubject = subjectName.trim();

    if (effectivePracticeMode) {
      if (practiceSetNumber < 1 || practiceSetNumber > 15) {
        setError("Practice Set must be between Set 1 and Set 15.");
        return;
      }

      if (hindiQuestions.length === 0) {
        setError("Please extract from PDF, paste, or generate Hindi questions first.");
        return;
      }

      try {
        setSuccess("Preparing Practice questions for database...");

        const questions = hindiQuestions.map((hindiQuestion, index) => {
          const hindiText = getTextValue(hindiQuestion.question, "hi");
          const hindiOptions = getOptionsValue(hindiQuestion.options, "hi");
          const correctAnswer = normalizeCorrectAnswerIndex(
            hindiQuestion.correctAnswer
          );

          if (!hindiText) {
            throw new Error(`Hindi question text missing at Q${index + 1}.`);
          }

          if (![4, 5].includes(hindiOptions.length)) {
            throw new Error(
              `Hindi options at Q${index + 1}: expected 4 or 5, found ${hindiOptions.length}.`
            );
          }

          if (correctAnswer < 0 || correctAnswer >= hindiOptions.length) {
            throw new Error(
              `Invalid correct answer (${hindiQuestion.correctAnswer}) at Q${index + 1}.`
            );
          }

          return {
            examCategory: category,
            examName: examTitle,
            tier: "",
            year: 0,
            date: "",
            shift: "",
            type: "practice",
            practiceSet: practiceSetNumber,
            questionNumber: hindiQuestion.questionNumber || index + 1,
            question: { en: "", hi: hindiText },
            options: { en: [], hi: hindiOptions },
            correctAnswer,
            explanation: {
              en: "",
              hi: getTextValue(hindiQuestion.explanation, "hi"),
            },
            subject:
              activeSubject ||
              (typeof hindiQuestion.subject === "string"
                ? hindiQuestion.subject
                : ""),
            imageUrl: hindiQuestion.imageUrl || "",
          };
        });

        setSuccess("Practice questions prepared. Saving to MongoDB...");
        const savedCount = await postQuestionsInBatches(questions);

        setSuccess(
          `✅ ${savedCount} Practice questions saved successfully. ${examTitle} — Set ${practiceSetNumber}`
        );
      } catch (err) {
        console.error("PRACTICE DATABASE SAVE ERROR:", err);
        setError(err.message || "Failed to save Practice questions.");
        setSuccess("");
      }

      return;
    }

    if (!paperSelected) {
      setError("Please select the complete paper structure.");
      return;
    }

    if (englishQuestions.length === 0 || hindiQuestions.length === 0) {
      setError(
        "Please upload a PDF, paste, or AI-generate both English and Hindi questions first."
      );
      return;
    }

    if (englishQuestions.length !== hindiQuestions.length) {
      setError(
        `Question count mismatch. English: ${englishQuestions.length}, Hindi: ${hindiQuestions.length}.`
      );
      return;
    }

    try {
      setSuccess("Preparing questions for database...");

      const questions = englishQuestions.map((englishQuestion, index) => {
        const hindiQuestion = hindiQuestions[index];
        if (!hindiQuestion) {
          throw new Error(`Hindi question missing at Q${index + 1}.`);
        }

        const englishCorrectAnswer = normalizeCorrectAnswerIndex(
          englishQuestion.correctAnswer
        );
        const hindiCorrectAnswer = normalizeCorrectAnswerIndex(
          hindiQuestion.correctAnswer
        );

        if (englishCorrectAnswer !== hindiCorrectAnswer) {
          throw new Error(
            `Correct answer mismatch at question ${index + 1}. English: ${englishCorrectAnswer}, Hindi: ${hindiCorrectAnswer}`
          );
        }

        const englishText = getTextValue(englishQuestion.question, "en");
        const hindiText = getTextValue(hindiQuestion.question, "hi");
        const englishOptions = getOptionsValue(englishQuestion.options, "en");
        const hindiOptions = getOptionsValue(hindiQuestion.options, "hi");

        if (!englishText) {
          throw new Error(`English question text missing at Q${index + 1}.`);
        }

        if (!hindiText) {
          throw new Error(`Hindi question text missing at Q${index + 1}.`);
        }

        if (![4, 5].includes(englishOptions.length)) {
          throw new Error(
            `English options at Q${index + 1}: expected 4 or 5, found ${englishOptions.length}.`
          );
        }

        if (![4, 5].includes(hindiOptions.length)) {
          throw new Error(
            `Hindi options at Q${index + 1}: expected 4 or 5, found ${hindiOptions.length}.`
          );
        }

        if (englishCorrectAnswer < 0 || englishCorrectAnswer > 4) {
          throw new Error(`Invalid correct answer at Q${index + 1}.`);
        }

        return {
          examCategory: category,
          examName: examTitle,
          tier: tier || "",
          year: Number(year),
          date: date || "",
          shift: shift || "",
          set: setName || "",
          questionNumber: englishQuestion.questionNumber || index + 1,
          question: { en: englishText, hi: hindiText },
          options: { en: englishOptions, hi: hindiOptions },
          correctAnswer: englishCorrectAnswer,
          explanation: {
            en: getTextValue(englishQuestion.explanation, "en"),
            hi: getTextValue(hindiQuestion.explanation, "hi"),
          },
          subject:
            activeSubject ||
            (typeof englishQuestion.subject === "string"
              ? englishQuestion.subject
              : typeof hindiQuestion.subject === "string"
                ? hindiQuestion.subject
                : ""),
          imageUrl: englishQuestion.imageUrl || hindiQuestion.imageUrl || "",
        };
      });

      setSuccess("Questions prepared. Saving to MongoDB...");
      const savedCount = await postQuestionsInBatches(questions);

      setSuccess(
        `✅ ${savedCount} questions saved successfully to MongoDB${
          activeSubject ? ` (${activeSubject} — ${setName})` : ""
        }.`
      );
    } catch (err) {
      console.error("DATABASE SAVE ERROR:", err);
      setError(err.message || "Failed to save questions to database.");
      setSuccess("");
    }
  };

  function normalizeCorrectAnswerIndex(answer) {
    if (typeof answer === "number") return answer;
    const value = String(answer).trim().toUpperCase();
    if (value === "A") return 0;
    if (value === "B") return 1;
    if (value === "C") return 2;
    if (value === "D") return 3;
    if (value === "E") return 4;
    return Number(value);
  }

  const getTextValue = (value, language) => {
    if (typeof value === "string") return value;
    if (!value || typeof value !== "object") return "";
    if (typeof value[language] === "string") return value[language];
    return "";
  };

  const getOptionsValue = (value, language) => {
    if (!value) return [];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (Array.isArray(value[language])) {
        return value[language].map((item) => getTextValue(item, language));
      }
    }
    if (Array.isArray(value)) {
      return value.map((item) =>
        typeof item === "string" ? item : getTextValue(item, language)
      );
    }
    return [];
  };

  const isBusy =
    extractingPdf ||
    generatingAi ||
    diImageSections.some((sec) => sec.uploading);

  const attachedQuestions = hindiQuestions.filter((q) => Boolean(q.imageUrl));

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Admin Dashboard
          </Link>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-950">
                {examTitle} Question Upload
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Upload a PDF question paper, paste questions directly, or generate bilingual MCQs with AI for an exam paper or practice set.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* PAPER / PRACTICE SET DETAILS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {!isPracticeRoute && (
            <div className="mb-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setUploadMode("exam");
                  setError("");
                  setSuccess("");
                }}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  uploadMode === "exam"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Exam Paper Upload
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadMode("practice");
                  setError("");
                  setSuccess("");
                }}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  uploadMode === "practice"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Practice Set Upload (Set 1–15)
              </button>
            </div>
          )}

          <h2 className="text-lg font-bold">
            {effectivePracticeMode ? "Practice Set Details" : "Paper Details"}
          </h2>

          {effectivePracticeMode ? (
            <>
              <p className="mt-1 text-sm text-slate-500">
                Configure the practice set for this examination.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Examination
                  </label>
                  <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
                    {examTitle}
                  </div>
                </div>

                {isPracticeRoute ? (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Practice Set
                    </label>
                    <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-3 text-sm font-bold text-indigo-700">
                      Set {practiceSetNumber}
                    </div>
                  </div>
                ) : (
                  <SelectBox
                    label="Practice Set"
                    value={selectedPracticeSet}
                    placeholder="Select Practice Set"
                    options={practiceSetOptions.map((n) => `Set ${n}`)}
                    onChange={(e) => {
                      const num = e.target.value.replace("Set ", "");
                      setSelectedPracticeSet(num);
                    }}
                  />
                )}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Language
                  </label>
                  <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
                    Hindi Only
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-indigo-50 p-4">
                <p className="text-sm font-bold text-indigo-800">
                  Practice Structure
                </p>
                <p className="mt-1 text-sm text-indigo-700">
                  {examTitle} → Set {practiceSetNumber} → Hindi Questions
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm text-slate-500">
                Select the exact paper for which these questions belong.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SelectBox
                  label="Year"
                  value={year}
                  placeholder="Select Year"
                  options={
                    examData?.years?.map((item) => String(item.year)) || []
                  }
                  onChange={(e) => handleYearChange(e.target.value)}
                />

                {isSSC && (
                  <SelectBox
                    label="Tier"
                    value={tier}
                    placeholder={year ? "Select Tier" : "Select Year First"}
                    disabled={!year}
                    options={
                      selectedYear?.tiers?.map((item) => item.name) || []
                    }
                    onChange={(e) => {
                      setTier(e.target.value);
                      setDate("");
                      setShift("");
                      setSetName("");
                    }}
                  />
                )}

                {isRailway && (
                  <SelectBox
                    label="Month"
                    value={month}
                    placeholder={year ? "Select Month" : "Select Year First"}
                    disabled={!year}
                    options={
                      selectedYear?.months?.map((item) => item.month) || []
                    }
                    onChange={(e) => {
                      setMonth(e.target.value);
                      setDate("");
                      setShift("");
                      setSetName("");
                    }}
                  />
                )}

                {(isPET || isSSC || isRailway || isUPESSC) && (
                  <SelectBox
                    label="Date"
                    value={date}
                    placeholder={
                      isSSC
                        ? tier
                          ? "Select Date"
                          : "Select Tier First"
                        : isRailway
                          ? month
                            ? "Select Date"
                            : "Select Month First"
                          : year
                            ? "Select Date"
                            : "Select Year First"
                    }
                    disabled={isSSC ? !tier : isRailway ? !month : !year}
                    options={dates}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setShift("");
                      setSetName("");
                    }}
                  />
                )}

                {(isSSC || isRailway) && (
                  <SelectBox
                    label="Shift"
                    value={shift}
                    placeholder={date ? "Select Shift" : "Select Date First"}
                    disabled={!date}
                    options={shifts}
                    onChange={(e) => {
                      setShift(e.target.value);
                      setSetName("");
                    }}
                  />
                )}

                {isPET && selectedYear?.shifts && (
                  <SelectBox
                    label="Shift"
                    value={shift}
                    placeholder="Select Shift"
                    options={selectedYear.shifts.map((item) => item.name)}
                    onChange={(e) => {
                      setShift(e.target.value);
                      setSetName("");
                    }}
                  />
                )}

                {isUPESSC && (
                  <SelectBox
                    label="Shift"
                    value={shift}
                    placeholder={date ? "Select Shift" : "Select Date First"}
                    disabled={!date}
                    options={shifts}
                    onChange={(e) => {
                      setShift(e.target.value);
                      setSetName("");
                    }}
                  />
                )}

                {isTGT && (
                  <SelectBox
                    label="Subject"
                    value={subjectName}
                    placeholder={shift ? "Select Subject" : "Select Shift First"}
                    disabled={!shift}
                    options={subjects}
                    onChange={(e) => {
                      setSubjectName(e.target.value);
                      setSetName("");
                    }}
                  />
                )}

                {(isPET || isGate || isUPESSC) && (
                  <SelectBox
                    label="Set"
                    value={setName}
                    placeholder={
                      isGate
                        ? year
                          ? "Select Set"
                          : "Select Year First"
                        : isTGT
                          ? subjectName
                            ? "Select Set"
                            : "Select Subject First"
                          : isUPESSC
                            ? shift
                              ? "Select Set"
                              : "Select Shift First"
                            : shift || date
                              ? "Select Set"
                              : "Select Paper First"
                    }
                    disabled={
                      isGate
                        ? !year
                        : isTGT
                          ? !subjectName
                          : isUPESSC
                            ? !shift
                            : !shift && !date
                    }
                    options={sets}
                    onChange={(e) => setSetName(e.target.value)}
                  />
                )}
              </div>

              <div className="mt-5 rounded-xl bg-indigo-50 p-4">
                <p className="text-sm font-bold text-indigo-800">
                  Paper Structure
                </p>
                <p className="mt-1 text-sm text-indigo-700">
                  {getStructureText(category, exam)}
                </p>
              </div>
            </>
          )}
        </section>

        {/* PDF QUESTION PAPER UPLOAD */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileUp size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Upload Exam Question Paper (PDF)
              </h2>
              <p className="text-xs text-slate-500">
                Upload a PDF (English, Hindi, or Bilingual) — AI will automatically extract and translate into both English & Hindi MCQs.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40">
              <FileUp size={28} className="text-indigo-600" />
              <span className="mt-2 text-sm font-bold text-slate-800">
                {pdfFile ? pdfFile.name : "Click to choose a PDF file"}
              </span>
              <span className="mt-1 text-xs text-slate-500">
                {pdfFile
                  ? `${(pdfFile.size / (1024 * 1024)).toFixed(2)} MB`
                  : "Supports .pdf up to 15 MB"}
              </span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                disabled={isBusy}
                onChange={(e) => {
                  const selected = e.target.files?.[0] || null;
                  setPdfFile(selected);
                  setError("");
                  setSuccess("");
                }}
                className="hidden"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExtractFromPdf}
                disabled={!pdfFile || isBusy}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {extractingPdf ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <FileUp size={17} />
                )}
                {extractingPdf
                  ? "Extracting Bilingual Questions..."
                  : "Extract Questions from PDF"}
              </button>

              {pdfFile && !isBusy && (
                <button
                  type="button"
                  onClick={() => {
                    setPdfFile(null);
                    setEnglishQuestions([]);
                    setHindiQuestions([]);
                    setError("");
                    setSuccess("");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <XCircle size={17} />
                  Clear PDF
                </button>
              )}
            </div>
          </div>
        </section>

        {/* AI BILINGUAL QUESTION GENERATOR */}
        <section className="mt-6 rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                AI Bilingual MCQ Generator
              </h2>
              <p className="text-xs text-slate-500">
                Or generate exam-grade English & Hindi MCQs from a topic or syllabus notes
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Topic / Subject
              </span>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., Indian Polity, Operating Systems, Modern History"
                disabled={isBusy}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Question Count (1–25)
              </span>
              <input
                type="number"
                min={1}
                max={25}
                value={aiCount}
                onChange={(e) => setAiCount(e.target.value)}
                disabled={isBusy}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
              />
            </label>

            <SelectBox
              label="Difficulty"
              value={aiDifficulty}
              placeholder="Select Difficulty"
              options={["Easy", "Moderate", "Hard"]}
              disabled={isBusy}
              onChange={(e) => setAiDifficulty(e.target.value)}
            />
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Syllabus / Notes / Reference Text (Optional)
            </span>
            <textarea
              rows={3}
              value={aiSourceText}
              onChange={(e) => setAiSourceText(e.target.value)}
              placeholder="Paste syllabus points, notes, or key facts to generate questions from..."
              disabled={isBusy}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />
          </label>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleGenerateWithAi}
              disabled={isBusy}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {generatingAi ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Sparkles size={17} />
              )}
              {generatingAi ? "Generating with AI..." : "Generate Bilingual MCQs"}
            </button>
          </div>
        </section>

        {/* DIRECT PASTE QUESTIONS (NO AI REQUIRED) */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FileText size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Direct Paste Questions (Instant Set Import — No AI)
                </h2>
                <p className="text-xs text-slate-500">
                  Paste questions with 4–5 options (A–E), Answer (A–E), and optional Explanation directly into the set.
                </p>
              </div>
            </div>

            {!effectivePracticeMode && (
              <select
                value={pasteTargetLang}
                onChange={(e) => setPasteTargetLang(e.target.value)}
                disabled={isBusy}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500"
              >
                <option value="both">Load into Both (EN + HI)</option>
                <option value="hi">Load into Hindi Only</option>
                <option value="en">Load into English Only</option>
              </select>
            )}
          </div>

          <textarea
            rows={7}
            value={rawQuestionsText}
            onChange={(e) => setRawQuestionsText(e.target.value)}
            disabled={isBusy}
            placeholder={`Q1. Fundamental Rights are enshrined in which Part?\nA) Part II\nB) Part III\nC) Part IV\nD) Part IVA\nE) इनमें से कोई नहीं\nAnswer: B\nExplanation: Part III covers Articles 12 to 35.`}
            className="mt-4 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
          />

          {pasteError && (
            <p className="mt-2 text-sm font-semibold text-red-600">{pasteError}</p>
          )}
          {pasteSuccess && (
            <p className="mt-2 text-sm font-semibold text-green-600">{pasteSuccess}</p>
          )}

          {/* MULTI-SECTION DI / GRAPH IMAGE UPLOADER */}
          <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <ImagePlus size={16} className="text-indigo-600" />
                DI / Graph Image Sections (Har 5 Questions Ke Liye Alag Image)
              </span>

              <button
                type="button"
                onClick={handleAddDiSection}
                disabled={isBusy}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-40"
              >
                + Add DI Section
              </button>
            </div>

            {diImageSections.map((sec, index) => (
              <div
                key={sec.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">
                    Section {index + 1}
                  </span>

                  <span className="text-xs font-semibold text-slate-600">Q#</span>
                  <input
                    type="number"
                    min={1}
                    value={sec.fromQ}
                    onChange={(e) =>
                      handleDiSectionRangeChange(sec.id, "fromQ", e.target.value)
                    }
                    disabled={isBusy || sec.uploading}
                    className="w-20 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-800"
                  />

                  <span className="text-xs font-bold text-slate-400">to</span>

                  <input
                    type="number"
                    min={1}
                    value={sec.toQ}
                    onChange={(e) =>
                      handleDiSectionRangeChange(sec.id, "toQ", e.target.value)
                    }
                    disabled={isBusy || sec.uploading}
                    className="w-20 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-800"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-indigo-700">
                    {sec.uploading && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    <span>
                      {sec.uploading
                        ? "Uploading..."
                        : sec.imageUrl
                          ? "Change Image"
                          : "Upload Graph / Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isBusy || sec.uploading}
                      onChange={(e) => handleDiSectionImageUpload(sec.id, e)}
                      className="hidden"
                    />
                  </label>

                  {sec.imageUrl && (
                    <span className="max-w-[190px] truncate text-xs font-semibold text-emerald-700">
                      ✓ {sec.fileName || "Uploaded"}
                    </span>
                  )}

                  {diImageSections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDiSection(sec.id)}
                      disabled={isBusy || sec.uploading}
                      className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-40"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            {attachedQuestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-600">
                <span className="font-semibold text-slate-700">
                  Images attached on ({attachedQuestions.length} Qs):
                </span>
                {attachedQuestions.map((q, i) => (
                  <span
                    key={`img-q-${q.questionNumber || i}`}
                    className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700"
                  >
                    Q{q.questionNumber || i + 1}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLoadPastedQuestions}
              disabled={!rawQuestionsText.trim() || isBusy}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Load Into Set
            </button>

            {rawQuestionsText && !isBusy && (
              <button
                type="button"
                onClick={() => {
                  setRawQuestionsText("");
                  setPasteError("");
                  setPasteSuccess("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear Text
              </button>
            )}
          </div>
        </section>

        {/* PARSE SUMMARY */}
        {(englishQuestions.length > 0 || hindiQuestions.length > 0) && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="font-bold">Question Import Summary</h2>
                <p className="text-sm text-slate-500">
                  Questions loaded from PDF upload, direct paste, or AI Generator.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <QuestionCount
                language="English"
                count={englishQuestions.length}
              />
              <QuestionCount language="Hindi" count={hindiQuestions.length} />
            </div>

            {englishQuestions.length > 0 && hindiQuestions.length > 0 && (
              <div
                className={`mt-4 rounded-xl p-4 text-sm font-semibold ${
                  englishQuestions.length === hindiQuestions.length
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {englishQuestions.length === hindiQuestions.length
                  ? `✓ Both languages contain ${englishQuestions.length} questions.`
                  : `⚠ Question count mismatch: English ${englishQuestions.length}, Hindi ${hindiQuestions.length}.`}
              </div>
            )}
          </section>
        )}

        {/* ERROR */}
        {error && (
          <div className="mt-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <XCircle size={20} className="shrink-0 text-red-600" />
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mt-6 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
            <CheckCircle2 size={20} className="shrink-0 text-green-600" />
            <p className="text-sm font-semibold text-green-700">{success}</p>
          </div>
        )}

        {/* STATUS */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Upload Status</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Status
              label={effectivePracticeMode ? "Practice Set Details" : "Paper Details"}
              done={paperSelected}
            />
            <Status
              label="English Questions"
              done={englishQuestions.length > 0}
            />
            <Status label="Hindi Questions" done={hindiQuestions.length > 0} />
          </div>
        </section>

        {/* VALIDATE & SAVE */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold">Ready for Validation</h2>
              <p className="mt-1 text-sm text-slate-500">
                English and Hindi questions will be checked question-by-question before saving.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={validateUpload}
                disabled={
                  !paperSelected ||
                  hindiQuestions.length === 0 ||
                  isBusy ||
                  (!effectivePracticeMode &&
                    (englishQuestions.length === 0 ||
                      englishQuestions.length !== hindiQuestions.length))
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <CheckCircle2 size={18} />
                Validate Questions
              </button>

              <button
                type="button"
                onClick={saveToDatabase}
                disabled={
                  !paperSelected ||
                  hindiQuestions.length === 0 ||
                  isBusy ||
                  (!effectivePracticeMode && englishQuestions.length === 0)
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <CheckCircle2 size={18} />
                Save to Database
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function QuestionCount({ language, count }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{language} Questions</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{count}</p>
      <p className="mt-1 text-xs text-green-600">Successfully loaded</p>
    </div>
  );
}

function SelectBox({
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled = false,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:text-slate-400"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Status({ label, done }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-semibold">{label}</span>

      {done ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
          <CheckCircle2 size={14} />
          Ready
        </span>
      ) : (
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-500">
          Pending
        </span>
      )}
    </div>
  );
}

function getStructureText(category, exam) {
  if (category === "upsssc") return "Year → Date / Shift → Set";
  if (category === "upessc" && exam === "tgt") return "Year → Date → Shift → Subject → Set";
  if (category === "upessc") return "Year → Date → Shift → Set";
  if (category === "ssc") return "Year → Tier → Date → Shift";
  if (category === "railway") return "Year → Month → Date → Shift";
  if (category === "gate") return "Year → Set";
  return "Year → Paper";
}

function getExamTitle(category, exam) {
  if (category === "upsssc") return "UPSSSC PET";
  if (category === "upessc") {
    if (exam === "uptet") return "UPTET (Paper 1 & 2)";
    if (exam === "super-tet") return "Super TET (2026)";
    if (exam === "tgt") return "UP TGT (2026)";
    if (exam === "pgt") return "UP PGT (2026)";
    return "UPESSC";
  }
  if (category === "ssc") return exam === "cgl" ? "SSC CGL" : "SSC CHSL";
  if (category === "railway") {
    if (exam === "group-d") return "RRB Group D";
    if (exam === "ntpc") return "RRB NTPC";
    return "RRB ALP";
  }
  if (category === "gate") return "GATE CSE";
  return "Exam";
}

export default AdminUpload;