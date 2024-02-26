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
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    lastMessage: {
      type: String,
      required: false,
    },
    read:{
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
