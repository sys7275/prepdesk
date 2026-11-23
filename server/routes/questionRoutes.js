import express from "express";

import {
  createQuestions,
  getQuestions,
  deleteQuestionsByBatch,
} from "../controllers/questionController.js";

const router = express.Router();

router.post("/bulk", createQuestions);

router.get("/", getQuestions);

router.delete("/batch", deleteQuestionsByBatch);

export default router;