import mongoose from "mongoose";

const aiCacheSchema = new mongoose.Schema(
  {
    cacheKey: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ["questions", "analysis"], required: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 },
  },
  { timestamps: true }
);

export default mongoose.model("AiCache", aiCacheSchema);