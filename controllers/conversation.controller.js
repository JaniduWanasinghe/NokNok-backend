import createError from "http-errors";
import Conversation from "../models/conversation.model.js";

export const createOrUpdateConversation = async (req, res, next) => {
  try {
    const { sellerId, buyerId, text,senderId } = req.body;
console.log(sellerId)
    // Check if the conversation exists
    let conversation = await Conversation.findOne({
      $or: [
        { sellerId, buyerId },
        { sellerId: buyerId, buyerId: sellerId }, 
      ],
    });
let buyerread=false
let sellerread=false
if(sellerId===senderId){
  sellerread=true
  buyerread=false
}
else{
  buyerread=true
  sellerread=false
}
    if (!conversation) {
      // If the conversation doesn't exist, create a new one
      conversation = new Conversation({
        sellerId:sellerId,
        buyerId,
        sellerread:sellerread,
        buyerread:buyerread,
        messages: [{ senderId: senderId, text }],
        lastMessage: text,
        read: false,
      });
      

      await conversation.save();
    } else {
      // If the conversation exists, push the new message to the array
      conversation.messages.push({ senderId: senderId, text });
      conversation.lastMessage = text;
      conversation.read = false;
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (err) {
    next(err);
  }
};
export const getAllConversationsForUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find all conversations where the given user is either the seller or the buyer
    const conversations = await Conversation.find({
      $or: [
        { sellerId: userId },
        { buyerId: userId },
      ],
    })
    .populate('sellerId', 'username email')  // Populate seller details with username and email
    .populate('buyerId', 'username email');   // Populate buyer details with username and email
console.log(userId)
    res.status(200).json(conversations);
  } catch (err) {
    next(err);
  }
};

// Get a conversation by its ID
export const getConversation = async (req, res, next) => {
  try {
    const conversationId = req.params.id;

    // Find the conversation by its ID
    const conversation = await Conversation.findById(conversationId)
      .populate('sellerId', 'username email') // Populate seller details with username and email
      .populate('buyerId', 'username email'); // Populate buyer details with username and email

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
