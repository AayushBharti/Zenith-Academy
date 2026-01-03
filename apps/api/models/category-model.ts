import mongoose from "mongoose";

// Define the Tags schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: { type: String },
  slug: { type: String },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

// Export the Tags model
export default mongoose.model("Category", categorySchema);
