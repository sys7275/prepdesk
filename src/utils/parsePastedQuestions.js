export function parsePastedQuestions(rawText) {
  if (!rawText || !rawText.trim()) {
    throw new Error("Please paste questions first.");
  }

  const normalized = rawText.replace(/\r\n/g, "\n").trim();

  // Split ONLY when a line starts with Q<number>. or Q<number>)
  const blocks = normalized
    .split(/\n(?=\s*Q\d+\s*[.)])/i)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    throw new Error("No questions found. Start each question with Q1., Q2., etc.");
  }

  const parsedQuestions = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    // Extract question number from first line (e.g. Q1.)
    const firstLineMatch = lines[0].match(/^Q(\d+)\s*[.)]\s*(.*)$/i);
    if (!firstLineMatch) {
      throw new Error(`Question block ${i + 1} invalid hai (Q1. format check karein).`);
    }

    const questionNumber = Number(firstLineMatch[1]);
    const questionLines = [];
    if (firstLineMatch[2]) {
      questionLines.push(firstLineMatch[2]);
    }

    const options = [];
    let correctAnswer = -1;
    let explanation = "";
    let mode = "question"; // "question" | "options" | "explanation"

    for (let j = 1; j < lines.length; j++) {
      const line = lines[j];

      // Match Option A) to E)
      const optMatch = line.match(/^([A-E])\s*[.)]\s*(.+)$/i);
      if (optMatch) {
        mode = "options";
        options.push({
          label: optMatch[1].toUpperCase(),
          text: optMatch[2].trim(),
        });
        continue;
      }

      // Match Answer: A-E
      const ansMatch = line.match(/^Answer\s*:\s*([A-E])/i);
      if (ansMatch) {
        const letter = ansMatch[1].toUpperCase();
        correctAnswer = ["A", "B", "C", "D", "E"].indexOf(letter);
        mode = "after_answer";
        continue;
      }

      // Match Explanation: ...
      const expMatch = line.match(/^Explanation\s*:\s*(.*)$/i);
      if (expMatch) {
        explanation = expMatch[1].trim();
        mode = "explanation";
        continue;
      }

      // Multi-line continuation
      if (mode === "question") {
        questionLines.push(line);
      } else if (mode === "options" && options.length > 0) {
        options[options.length - 1].text += " " + line;
      } else if (mode === "explanation") {
        explanation += (explanation ? "\n" : "") + line;
      }
    }

    const questionText = questionLines.join("\n").trim();

    if (!questionText || options.length < 4 || options.length > 5) {
      throw new Error(
        `Question ${questionNumber} (block ${i + 1}) incomplete hai (Question + 4 ya 5 options zaroori hain, mile: ${options.length}).`
      );
    }

    if (correctAnswer < 0 || correctAnswer >= options.length) {
      throw new Error(
        `Question ${questionNumber} mein valid Answer (A–E) missing hai.`
      );
    }

    parsedQuestions.push({
      questionNumber,
      question: questionText,
      options,
      correctAnswer,
      explanation,
    });
  }

  return parsedQuestions;
}