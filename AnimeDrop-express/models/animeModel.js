import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    review: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AnimeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x400?text=No+Image",
    },
    genres: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["Planning", "Watching", "Completed", "Dropped", "On Hold"],
      default: "Planning",
    },
    episodes: {
      type: Number,
      default: 0,
    },
    episodesWatched: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    reviews: [ReviewSchema],
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const AnimeModel = mongoose.model("Animes", AnimeSchema);

export default AnimeModel;
