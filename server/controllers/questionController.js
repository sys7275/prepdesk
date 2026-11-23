import Question from "../models/Question.js";

// Save questions to database
export const createQuestions = async (req, res) => {
  try {
    const { questions, batchIndex } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions data is required",
      });
    }

    const firstQuestion = questions[0];

    const paperFilter =
      firstQuestion.type === "practice"
        ? {
            examCategory: firstQuestion.examCategory,
            examName: firstQuestion.examName,
            type: "practice",
            practiceSet: firstQuestion.practiceSet,
          }
        : {
            examCategory: firstQuestion.examCategory,
            examName: firstQuestion.examName,
            year: firstQuestion.year,
            date: firstQuestion.date,
            shift: firstQuestion.shift,
            set: firstQuestion.set || "",
          };

    // Delete old questions only on the first batch so subsequent batches append cleanly
    const isFirstBatch =
      batchIndex === 0 ||
      batchIndex === undefined ||
      Number(firstQuestion.questionNumber) <= 25;

    if (isFirstBatch) {
      const deleted = await Question.deleteMany(paperFilter);
      console.log(`Removed ${deleted.deletedCount} old questions`);
    }

    // Save fresh questions
    const savedQuestions = await Question.insertMany(questions, {
      ordered: true,
    });

    return res.status(201).json({
      success: true,
      message: `${savedQuestions.length} questions saved successfully`,
      count: savedQuestions.length,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error("Save Questions Error:", error);

    const statusCode =
      error.name === "ValidationError" || error.name === "CastError"
        ? 400
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: "Failed to save questions",
      error: error.message,
    });
  }
};

// Get questions from database
export const getQuestions = async (req, res) => {
  try {
    const {
      examCategory,
      examName,
      year,
      date,
      shift,
      set,
      type,
      practiceSet,
    } = req.query;

    const filter = {};

    if (examCategory) filter.examCategory = examCategory;
    if (examName) filter.examName = examName;
    if (year !== undefined && year !== "") filter.year = Number(year);
    if (date) filter.date = date;
    if (shift) filter.shift = shift;
    if (set) filter.set = set;
    if (type) filter.type = type;
    if (practiceSet !== undefined && practiceSet !== "") {
      filter.practiceSet = Number(practiceSet);
    }

    console.log("QUESTION FILTER:", filter);

    const questions = await Question.find(filter)
      .sort({ questionNumber: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Get Questions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
      error: error.message,
    });
  }
};

// Delete latest duplicate batch of questions
export const deleteLatestBatch = async (req, res) => {
  try {
    const { examName, year, date, shift } = req.query;

    const filter = {
      examName,
      year: Number(year),
      date,
      shift,
    };

    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    if (questions.length <= 100) {
      return res.status(400).json({
        success: false,
        message: `Only ${questions.length} questions found. Nothing to delete.`,
      });
    }

    const latestBatch = questions.slice(0, 100);
    const ids = latestBatch.map((question) => question._id);

    const result = await Question.deleteMany({
      _id: { $in: ids },
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} latest duplicate questions deleted successfully.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete Latest Batch Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete duplicate batch",
      error: error.message,
    });
  }
};

// Delete all questions for a specific exam/date/shift
export const deleteQuestionsByBatch = async (req, res) => {
  try {
    const { examName, year, date, shift } = req.query;

    if (!examName || !year || !date || !shift) {
      return res.status(400).json({
        success: false,
        message: "examName, year, date and shift are required",
      });
    }

    const result = await Question.deleteMany({
      examName,
      year: Number(year),
      date,
      shift,
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} questions deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete Questions Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete questions",
      error: error.message,
    });
  }
};