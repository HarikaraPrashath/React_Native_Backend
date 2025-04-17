import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    caption: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
      require: true,
      min: 1,
      max: 5,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default  Book
