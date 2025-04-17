import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../model/book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const uploadImageResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadImageResponse.secure_url;

    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await newBook.save();
    res.status(500).json(newBook);
  } catch (error) {
    console.log("Error message while Book uploading", error);
  }
});

router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    const book = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBook = await Book.countDocuments();

    res.send({
      book,
      currentPage: page,
      totalBook,
      totalPage: Math.ceil(totalBook / limit),
    });
  } catch (err) {
    console.log("Error in get all book details", err);
  }
});

//get recommended book when user login to app

router.get("/user", protectRoute, async (req, res) => {
  try {
    const book = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(book);
  } catch (err) {
    console.log("user get book error", err);
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    //delete image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Delete image error", err);
      }
    }

    await book.deleteOne();
    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (err) {
    console.log("Error in delete  book details", err);
  }
});

export default router;
