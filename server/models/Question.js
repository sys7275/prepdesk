import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    // =========================
    // EXAM DETAILS
    // =========================

    examCategory: {
      type: String,
      required: true,
      trim: true,
    },

    examName: {
      type: String,
      required: true,
      trim: true,
    },

    tier: {
      type: String,
      default: "",
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    date: {
      type: String,
      default: "",
      trim: true,
    },

   shift: { type: String, default: "", trim: true },

   set: {
  type: String,
  default: "",
  trim: true,
},

    // =========================
    // QUESTION
    // =========================

    questionNumber: {
      type: Number,
      required: true,
    },

    question: {
     en: { type: String, default: "" },
hi: { type: String, required: true },
    },

    // =========================
    // OPTIONS
    // =========================

options: {
      en: {
        type: [String],
        default: [],
        validate: {
          validator: function (value) {
            if (this.type === "practice" && (!value || value.length === 0)) {
              return true;
            }
            return Array.isArray(value) && (value.length === 4 || value.length === 5);
          },
          message: "English must contain 4 or 5 options",
        },
      },

      hi: {
        type: [String],
        required: true,
        validate: {
          validator: (value) =>
            Array.isArray(value) && (value.length === 4 || value.length === 5),
          message: "Hindi must contain 4 or 5 options",
        },
      },
    },

    // =========================
    // CORRECT ANSWER
    // =========================

    correctAnswer: {
  type: Number,
  required: true,
  min: 0,
  max: 4,
},

    // =========================
    // EXPLANATION
    // =========================

    explanation: {
      en: {
        type: String,
        default: "",
      },

      hi: {
        type: String,
        default: "",
      },
    },
imageUrl: {
  type: String,
  default: "",
  trim: true,
},

type: {
  type: String,
  enum: ["pyq", "practice"],
  default: "pyq",
},

practiceSet: {
  type: Number,
  min: 1,
  max: 15,
  default: null,
},

    // =========================
    // SUBJECT
    // =========================

    subject: {
      type: String,
      default: "",
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);

const Question = mongoose.model(
  "Question",
  questionSchema
);

export default Question;