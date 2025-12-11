import NotificationModel from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.find({
      recipient: req.user._id,
    })
      .populate("sender", "username avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      message: "Notifications retrieved",
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await NotificationModel.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    notification.read = true;
    await notification.save();

    res.json({
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await NotificationModel.updateMany({ recipient: req.user._id, read: false }, { read: true });

    res.json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await NotificationModel.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await notification.deleteOne();

    res.json({
      message: "Notification deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
    });
  }
};
