import createError from "http-errors";
import Conversation from "../models/conversation.model";

export const createOrUpdateConversation = async (req, res, next) => {
  try {
    const { sellerId, buyerId, text } = req.body;

    // Check if the conversation exists
    let conversation = await Conversation.findOne({
      $or: [
        { sellerId, buyerId },
        { sellerId: buyerId, buyerId: sellerId }, 
      ],
    });

    if (!conversation) {
      // If the conversation doesn't exist, create a new one
      conversation = new Conversation({
        sellerId,
        buyerId,
        messages: [{ senderId: req.userId, text }],
        lastMessage: text,
        read: false,
      });

      await conversation.save();
    } else {
      // If the conversation exists, push the new message to the array
      conversation.messages.push({ senderId: req.userId, text });
      conversation.lastMessage = text;
      conversation.read = false;
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (err) {
    next(err);
  }
};

// Get a conversation by sellerId and buyerId
export const getConversation = async (req, res, next) => {
  try {
    const { sellerId, buyerId } = req.query;

    // Find the conversation based on sellerId and buyerId
    const conversation = await Conversation.findOne({
      $or: [
        { sellerId, buyerId },
        { sellerId: buyerId, buyerId: sellerId }, // Check reverse relationship
      ],
    });

    if (!conversation) {
      return next(createError(404, "Conversation not found"));
    }

    res.status(200).json(conversation);
  } catch (err) {
    next(err);
  }
};

// Delete a conversation by sellerId and buyerId
export const deleteConversation = async (req, res, next) => {
  try {
    const { sellerId, buyerId } = req.query;

    // Find and delete the conversation based on sellerId and buyerId
    const deletedConversation = await Conversation.findOneAndDelete({
      $or: [
        { sellerId, buyerId },
        { sellerId: buyerId, buyerId: sellerId }, // Check reverse relationship
      ],
    });

    if (!deletedConversation) {
      return next(createError(404, "Conversation not found"));
    }

    res.status(200).json(deletedConversation);
  } catch (err) {
    next(err);
  }
};

// Change the read status of a conversation
export const changeReadStatus = async (req, res, next) => {
  try {
    const { sellerId, buyerId, read } = req.body;

    // Find the conversation based on sellerId and buyerId
    const conversation = await Conversation.findOne({
      $or: [
        { sellerId, buyerId },
        { sellerId: buyerId, buyerId: sellerId }, // Check reverse relationship
      ],
    });

    if (!conversation) {
      return next(createError(404, "Conversation not found"));
    }

    // Update the read status
    conversation.read = read;
    await conversation.save();

    res.status(200).json(conversation);
  } catch (err) {
    next(err);
  }
};
