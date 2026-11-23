function getGoogleSheetInfo(sheetUrl) {
  const url = String(sheetUrl || "").trim();

  if (!url) {
    throw new Error("Google Sheet URL is required.");
  }

  // OpenSheet URL
  if (url.includes("opensheet.elk.sh")) {
    return {
      type: "opensheet",
      url,
    };
  }

  // Google Sheets URL
  const match = url.match(
    /spreadsheets\/d\/([a-zA-Z0-9-_]+)/
  );

  if (!match) {
    throw new Error(
      "Invalid Google Sheet URL. Please paste a valid Google Sheets link."
    );
  }

  const sheetId = match[1];

  const gidMatch = url.match(
    /[?&#]gid=([0-9]+)/
  );

  const gid = gidMatch ? gidMatch[1] : "0";

  return {
    type: "google",
    sheetId,
    gid,
  };
}


// ======================================================
// FETCH GOOGLE SHEET QUESTIONS
// ======================================================

export async function fetchSheetQuestions(sheetUrl) {
  const sheetInfo = getGoogleSheetInfo(sheetUrl);

  let fetchUrl = "";

  // ------------------------------------------
  // OPENSHEET
  // ------------------------------------------

  if (sheetInfo.type === "opensheet") {
    fetchUrl = sheetInfo.url;
  }

  // ------------------------------------------
  // GOOGLE SHEETS → CSV
  // ------------------------------------------

  if (sheetInfo.type === "google") {
    fetchUrl =
      `https://docs.google.com/spreadsheets/d/${sheetInfo.sheetId}/export?format=csv&gid=${sheetInfo.gid}`;
  }

  const response = await fetch(fetchUrl);

  if (!response.ok) {
    throw new Error(
      "Google Sheet could not be read. Make sure the sheet is shared as 'Anyone with the link - Viewer'."
    );
  }

  const text = await response.text();

  // ------------------------------------------
  // OPENSHEET → JSON
  // ------------------------------------------

  if (sheetInfo.type === "opensheet") {
    let rows;

    try {
      rows = JSON.parse(text);
    } catch {
      throw new Error(
        "Google Sheet returned invalid JSON. Please check the sheet link and sharing permission."
      );
    }

    if (!Array.isArray(rows)) {
      throw new Error(
        "Google Sheet data is not an array."
      );
    }

    return normalizeRows(rows);
  }

  // ------------------------------------------
  // GOOGLE SHEETS → CSV
  // ------------------------------------------

  const rows = parseCsv(text);

  if (rows.length < 2) {
    throw new Error(
      "Google Sheet is empty or contains no question rows."
    );
  }

  return normalizeCsvRows(rows);
}

function validateQuestionRow(item) {
  const reasons = [];

  if (!item.questionNumber) {
    reasons.push("questionNumber missing");
  }

  if (!item.question) {
    reasons.push("question missing");
  }

  if (!item.options[0]) {
    reasons.push("optionA missing");
  }

  if (!item.options[1]) {
    reasons.push("optionB missing");
  }

  if (!item.options[2]) {
    reasons.push("optionC missing");
  }

  if (!item.options[3]) {
    reasons.push("optionD missing");
  }

  if (
  !["A", "B", "C", "D", "E"].includes(
    item.correctAnswer
  )
) {
    reasons.push(
      `invalid correctAnswer: "${item.correctAnswer}"`
    );
  }

  if (reasons.length > 0) {
    console.warn(
      `❌ Question Q${item.questionNumber || "?"} rejected:`,
      reasons,
      item
    );

    return false;
  }

  return true;
}

// ======================================================
// NORMALIZE OPENSHEET JSON
// ======================================================



function normalizeRows(rows) {
  return rows
    .map((row) => ({
      questionNumber: Number(
        row.questionNumber
      ),

      question: String(
        row.question || ""
      ).trim(),

      // IMAGE URL
      imageUrl: String(
        row.imageUrl || ""
      ).trim(),

  options: [
  String(row.optionA || "").trim(),
  String(row.optionB || "").trim(),
  String(row.optionC || "").trim(),
  String(row.optionD || "").trim(),
  String(row.optionE || "").trim(),
].filter(Boolean),


      correctAnswer: String(
        row.correctAnswer || ""
      )
        .trim()
        .toUpperCase(),
    }))
    .filter(validateQuestionRow)

    .sort(
      (a, b) =>
        a.questionNumber -
        b.questionNumber
    );
}


// ======================================================
// CSV PARSER
// ======================================================

function parseCsv(csv) {
  const rows = [];

  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const next = csv[i + 1];

    // Escaped double quote
    if (
      char === '"' &&
      inQuotes &&
      next === '"'
    ) {
      cell += '"';
      i++;
      continue;
    }

    // Start / end quotes
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    // Comma
    if (
      char === "," &&
      !inQuotes
    ) {
      row.push(cell);
      cell = "";
      continue;
    }

    // New line
    if (
      (char === "\n" ||
        char === "\r") &&
      !inQuotes
    ) {
      if (
        char === "\r" &&
        next === "\n"
      ) {
        i++;
      }

      row.push(cell);
      cell = "";

      if (
        row.some(
          (value) =>
            value.trim() !== ""
        )
      ) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    cell += char;
  }

  // Last row
  if (
    cell !== "" ||
    row.length > 0
  ) {
    row.push(cell);

    if (
      row.some(
        (value) =>
          value.trim() !== ""
      )
    ) {
      rows.push(row);
    }
  }

  return rows;
}


// ======================================================
// NORMALIZE CSV
// ======================================================

function normalizeCsvRows(rows) {
  const headers = rows[0].map(
    (header) =>
      String(header)
        .trim()
        .replace(/^\uFEFF/, "")
  );

  const getIndex = (name) =>
    headers.findIndex(
      (header) =>
        header.toLowerCase() ===
        name.toLowerCase()
    );

  const questionNumberIndex =
    getIndex("questionNumber");

  const questionIndex =
    getIndex("question");

  // IMAGE URL
  // Optional column
  const imageUrlIndex =
    getIndex("imageUrl");

  const optionAIndex =
    getIndex("optionA");

  const optionBIndex =
    getIndex("optionB");

  const optionCIndex =
    getIndex("optionC");

  const optionDIndex =
    getIndex("optionD");

const optionEIndex =
  getIndex("optionE");

  const correctAnswerIndex =
    getIndex("correctAnswer");

  // Required columns
  const requiredIndexes = [
    questionNumberIndex,
    questionIndex,
    optionAIndex,
    optionBIndex,
    optionCIndex,
    optionDIndex,
    correctAnswerIndex,
  ];

  if (
    requiredIndexes.some(
      (index) => index === -1
    )
  ) {
    throw new Error(
      "Google Sheet columns must be: questionNumber, question, imageUrl, optionA, optionB, optionC, optionD, correctAnswer"
    );
  }

  return rows
    .slice(1)
    .map((row) => ({
      questionNumber: Number(
        row[questionNumberIndex]
      ),

      question: String(
        row[questionIndex] || ""
      ).trim(),

      // IMAGE URL
      // If imageUrl column does not exist,
      // keep it empty.
      imageUrl:
        imageUrlIndex === -1
          ? ""
          : String(
              row[imageUrlIndex] || ""
            ).trim(),

 options: [
  String(
    row[optionAIndex] || ""
  ).trim(),

  String(
    row[optionBIndex] || ""
  ).trim(),

  String(
    row[optionCIndex] || ""
  ).trim(),

  String(
    row[optionDIndex] || ""
  ).trim(),

  optionEIndex === -1
    ? ""
    : String(
        row[optionEIndex] || ""
      ).trim(),
].filter(Boolean),

      correctAnswer: String(
        row[correctAnswerIndex] || ""
      )
        .trim()
        .toUpperCase(),
    }))
    .filter(validateQuestionRow)

    .sort(
      (a, b) =>
        a.questionNumber -
        b.questionNumber
    );
}