import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { createWorker } from "tesseract.js";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// ======================================================
// CLEAN TEXT
// ======================================================

function cleanText(text = "") {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ======================================================
// ANSWER INDEX
// ======================================================

function getAnswerIndex(answer) {
  if (!answer) return null;

  const map = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
  };

  return map[answer.toLowerCase()] ?? null;
}
// ======================================================
// HINDI PDF OCR
// ======================================================

async function extractHindiOCR(pdf) {
  console.log("Hindi OCR started...");

  const worker = await createWorker("hin+eng");

  let allText = "";

  try {
    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
      console.log(`Hindi OCR page ${pageNo}/${pdf.numPages}`);

      const page = await pdf.getPage(pageNo);

      const viewport = page.getViewport({
        scale: 2.2,
      });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      const { data } = await worker.recognize(canvas);

      allText += `\n${data.text}\n`;

      canvas.width = 1;
      canvas.height = 1;
    }
  } finally {
    await worker.terminate();
  }

  console.log("Hindi OCR completed");

  return allText
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n+/g, "\n");
}
// ======================================================
// HINDI OCR QUESTION REBUILD
// OCR question numbers ko trust nahi karega.
// A-B-C-D option sequence se questions rebuild honge.
// ======================================================

// ======================================================
// HINDI OCR QUESTION REBUILD
// OCR question number ko primary boundary maana jayega.
// A-B-C-D sequence par depend nahi karega.
// ======================================================

function rebuildHindiOCRQuestions(text) {
  const normalized = text
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();

  /*
    Hindi OCR mein question number different forms mein aa sakta hai:

    1.
    2)
    3
    Q1.
    Q.1.
    Q 1.
  */

  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const questionStarts = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const match = line.match(
      /^(?:Q\s*\.?\s*)?(\d{1,3})\s*[\.\):\-]?\s*(.*)$/i
    );

    if (!match) {
      continue;
    }

    const number = Number(match[1]);

    /*
      Sirf 1-100 ko valid question number maanenge.
      OCR ke 200, 111, 139 etc. ko ignore karenge.
    */

    if (number < 1 || number > 100) {
      continue;
    }

    questionStarts.push({
      number,
      lineIndex: i,
      text: match[2] || "",
    });
  }

  console.log(
    "HI OCR possible question starts:",
    questionStarts.length
  );

  console.log(
    "HI OCR detected question numbers:",
    questionStarts.map((q) => q.number)
  );

  /*
    Duplicate / random OCR numbers ko handle karna.

    Agar same question number baar-baar aa raha hai,
    to first sensible occurrence rakhenge.
  */

  const selected = [];
  const usedNumbers = new Set();

  for (const item of questionStarts) {
    if (usedNumbers.has(item.number)) {
      continue;
    }

    usedNumbers.add(item.number);
    selected.push(item);
  }

  /*
    Sort by actual PDF/OCR position.
  */

  selected.sort(
    (a, b) => a.lineIndex - b.lineIndex
  );

  console.log(
    "HI OCR unique question starts:",
    selected.length
  );

  /*
    IMPORTANT:
    OCR numbers galat ho sakte hain.

    Isliye final question numbering OCR number se nahi,
    PDF mein milne wale sequential question blocks se hogi.

    Example:
    OCR: 1,2,3,20,5,3,7...
    Output: Q1,Q2,Q3,Q4,Q5,Q6,Q7...
  */

  let rebuilt = "";

  for (let i = 0; i < selected.length; i++) {
    const current = selected[i];

    const next =
      i + 1 < selected.length
        ? selected[i + 1]
        : null;

    const startLine = current.lineIndex;

    const endLine = next
      ? next.lineIndex
      : lines.length;

    const blockLines = lines.slice(
      startLine,
      endLine
    );

    if (blockLines.length === 0) {
      continue;
    }

    /*
      First line se OCR question number remove karo.
    */

    let block = blockLines.join(" ");

    block = block.replace(
      /^(?:Q\s*\.?\s*)?\d{1,3}\s*[\.\):\-]?\s*/i,
      ""
    );

    block = block.trim();

    if (!block) {
      continue;
    }

    /*
      Sequential numbering.
    */

    rebuilt +=
      `\nQ${i + 1}. ${block}\n`;
  }

  console.log(
    "HI OCR rebuilt question blocks:",
    selected.length
  );

  return rebuilt;
}
// ======================================================
// READ PDF
// ======================================================

export async function parseQuestionPDF(file, language = "en") {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  console.log(
    `${language.toUpperCase()} PDF pages:`,
    pdf.numPages
  );

  // ==================================================
  // ENGLISH PDF
  // Keep existing PDF.js extraction
  // ==================================================

  if (language === "en") {
    let allText = "";

    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
      const page = await pdf.getPage(pageNo);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str)
        .join(" ");

      allText += `\n${pageText}\n`;
    }

    allText = allText
      .replace(/\r/g, "\n")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n+/g, "\n");

    return parseQuestions(allText, language);
  }

  // ==================================================
  // HINDI PDF
  // Use OCR because PDF.js Hindi font encoding is broken
  // ==================================================

 if (language === "hi") {
  const allText = await extractHindiOCR(pdf);

  console.log(
    "Hindi OCR text length:",
    allText.length
  );

  // Hindi OCR ke galat question numbers ko ignore karo
  // aur A-B-C-D option sequence se questions rebuild karo.
  const rebuiltHindiText =
    rebuildHindiOCRQuestions(allText);

  if (!rebuiltHindiText) {
    console.error(
      "Hindi OCR: Could not rebuild question blocks."
    );

    return [];
  }

   return parseQuestions(
    rebuiltHindiText,
    language
  );
  } // closes if (language === "hi")

} // closes parseQuestionPDF()

// ======================================================
// FIND QUESTION BLOCKS
// Supports:
// Q1.
// Q.1.
// Q 1.
// Q. 1.
// ======================================================

function getQuestionBlocks(text) {
  const questionStartRegex =
    /(?:^|\s)Q\s*\.?\s*(\d+)\s*\.\s*/gi;

  const matches = [...text.matchAll(questionStartRegex)];

  console.log(
    "Question blocks found:",
    matches.length
  );

  const blocks = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];

    const questionNumber = Number(match[1]);

    const start =
      match.index + match[0].length;

    const end =
      i + 1 < matches.length
        ? matches[i + 1].index
        : text.length;

    const content = text.substring(start, end);

    blocks.push({
      questionNumber,
      content,
    });
  }

  return blocks;
}

// ======================================================
// FIND ANSWER
// Supports:
// Ans.(a)
// Ans. (a)
// Ans (a)
// Ans: (a)
// Answer: (a)
// Correct Answer: (a)
// Ans. a
// ======================================================

function findAnswer(block) {
  const answerRegex =
    /(?:Ans(?:wer)?|Correct\s*Answer)\s*[:.]?\s*\(?\s*([ABCD])\s*\)?/i;

  const match = block.match(answerRegex);

  if (!match) {
    return null;
  }

  return {
    letter: match[1].toLowerCase(),
    index: match.index,
    fullMatch: match[0],
  };
}

// ======================================================
// FIND OPTIONS
//
// Supports:
// (a) option
// (b) option
// (c) option
// (d) option
//
// Also supports:
// a) option
// b) option
// c) option
// d) option
// ======================================================

function getOptions(block, answerInfo, questionNumber) {
  // Find all possible option markers
  // Supports:
  // (a) Option
  // (A) Option
  // a) Option
  // A) Option

  const optionRegex =
    /(?:^|\s)(?:\(([ABCDabcd])\)|([ABCDabcd])\))\s*/g;

  const matches = [...block.matchAll(optionRegex)];

  if (matches.length === 0) {
    return [];
  }

  /*
    Important:
    PDFs can contain things like:

    Assertion (A):
    Reason (R):

    We must NOT treat "(A)" as an answer option.

    Therefore we search for the actual consecutive
    A → B → C → D option sequence.
  */

  let optionStartIndex = -1;
  let selectedMatches = [];

  for (let i = 0; i < matches.length; i++) {
    const first = matches[i];

    const firstLetter = (
      first[1] || first[2]
    ).toLowerCase();

    if (firstLetter !== "a") {
      continue;
    }

    const sequence = [first];

    let expected = "b";

    for (let j = i + 1; j < matches.length; j++) {
      const current = matches[j];

      const currentLetter = (
        current[1] || current[2]
      ).toLowerCase();

      if (currentLetter === expected) {
        sequence.push(current);

        if (expected === "b") {
          expected = "c";
        } else if (expected === "c") {
          expected = "d";
        } else if (expected === "d") {
          break;
        }
      }
    }

    if (sequence.length === 4) {
      optionStartIndex = i;
      selectedMatches = sequence;
      break;
    }
  }

  // No A-B-C-D sequence found
  if (selectedMatches.length !== 4) {
    console.warn(
      `Q${questionNumber}: A-B-C-D option sequence not found`
    );

    return [];
  }

  const options = [];

  for (let i = 0; i < selectedMatches.length; i++) {
    const match = selectedMatches[i];

    const start =
      match.index + match[0].length;

    let end =
      i + 1 < selectedMatches.length
        ? selectedMatches[i + 1].index
        : block.length;

    // Don't include Ans.(x) inside option text
    if (
      answerInfo &&
      answerInfo.index > start &&
      answerInfo.index < end
    ) {
      end = answerInfo.index;
    }

    const optionText = cleanText(
      block.substring(start, end)
    );

    if (optionText) {
      options.push(optionText);
    }
  }

  console.log(
    `Q${questionNumber}: ${options.length} options extracted`
  );

  return options;
}


// ======================================================
// PARSE QUESTIONS
// ======================================================

function parseQuestions(text, language) {
  const questions = [];

  const blocks = getQuestionBlocks(text);

  console.log(
    `${language.toUpperCase()} question blocks found:`,
    blocks.length
  );

  for (const item of blocks) {
    const questionNumber = item.questionNumber;

    let block = cleanText(item.content);

    // ==================================================
    // ANSWER
    // ==================================================

    const answerInfo = findAnswer(block);

    if (!answerInfo) {
      console.warn(
        `Answer not found for Q${questionNumber}`
      );

      continue;
    }

    const answer = answerInfo.letter;

 // =========================
//       OPTIONS
// =========================

const options = getOptions(
  block,
  answerInfo,
  questionNumber
);
    // ==================================================
    // QUESTION TEXT
    // ==================================================

    const optionStartRegex =
      /(?:^|\s)(?:\(([ABCD])\)|([ABCD])\))\s*/i;

    const firstOptionMatch =
      block.match(optionStartRegex);

    let questionText = block;

    if (firstOptionMatch) {
      questionText = block
        .substring(
          firstOptionMatch.index +
            firstOptionMatch[0].match(/^\s*/)[0].length
        )
        .trim();

      // Remove everything starting from first option
      const actualFirstOptionIndex =
        block.search(optionStartRegex);

      if (actualFirstOptionIndex !== -1) {
        questionText = block
          .substring(0, actualFirstOptionIndex)
          .trim();
      }
    }

    // ==================================================
    // REMOVE ANSWER IF IT SOMEHOW APPEARS IN QUESTION
    // ==================================================

    questionText = questionText
      .replace(
        /(?:Ans(?:wer)?|Correct\s*Answer)\s*[:.]?\s*\(?\s*[ABCD]\s*\)?/gi,
        ""
      )
      .trim();

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!questionText) {
      console.warn(
        `Q${questionNumber}: question text missing`
      );

      continue;
    }

    if (options.length !== 4) {
      console.warn(
        `Q${questionNumber}: ${options.length} options found`
      );

      continue;
    }

    // ==================================================
    // SAVE
    // ==================================================

    questions.push({
      id: `q-${questionNumber}`,

      question: {
        en:
          language === "en"
            ? questionText
            : "",

        hi:
          language === "hi"
            ? questionText
            : "",
      },

      options: {
        en:
          language === "en"
            ? options
            : ["", "", "", ""],

        hi:
          language === "hi"
            ? options
            : ["", "", "", ""],
      },

      correctAnswer:
        getAnswerIndex(answer),

      explanation: {
        en: "",
        hi: "",
      },

      questionNumber,

      subject: "",
    });
  }

  // ==================================================
  // DEBUG
  // ==================================================

  const questionNumbers =
    questions.map(
      (q) => q.questionNumber
    );

  console.log(
    `${language.toUpperCase()} extracted:`,
    questions.length
  );

  console.log(
    `${language.toUpperCase()} question numbers:`,
    questionNumbers
  );

  // ==================================================
  // FIND MISSING QUESTIONS
  // ==================================================

  if (questionNumbers.length > 0) {
    const max = Math.max(
      ...questionNumbers
    );

    const missing = [];

    for (let i = 1; i <= max; i++) {
      if (!questionNumbers.includes(i)) {
        missing.push(i);
      }
    }

    if (missing.length > 0) {
      console.warn(
        `${language.toUpperCase()} missing questions:`,
        missing
      );
    }
  }

  return questions;
}