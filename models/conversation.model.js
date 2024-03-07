import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    senderId: {
      type: String,
      
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ConversationSchema = new Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastMessage: {
      type: String,
      required: false,
    },
    sellerread:{
      type: Boolean,
      required:false
    },
    buyerread:{
      type: Boolean,
      required:false
    },
    messages: [MessageSchema]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", ConversationSchema);
