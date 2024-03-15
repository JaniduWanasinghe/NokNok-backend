import mongoose from "mongoose";
const { Schema } = mongoose;


const HiredTaskSchema = new Schema(
  {
    sellerId: {
      type: String,
      required: true,
    },
    buyerId: {
        type: String,
        required: true,
      },
      buyerName:{
        type: String,
        required: false,
      },
    title: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: true,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: String,
      required: false,
    },

    serviceId: {
      type: String,
      required: true,
    },
    rate:{
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    hours: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    payment: {
      type: String,
      default:"Pending",
    },
    buyerImage:{
      type: String,
      required: false,
    }

 
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HiredTask", HiredTaskSchema);
