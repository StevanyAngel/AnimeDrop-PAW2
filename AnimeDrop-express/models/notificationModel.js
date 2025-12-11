import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    type: {
      type: String,
      enum: ["follow", "review", "system"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: "",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.model("Notifications", NotificationSchema);

export default NotificationModel;
