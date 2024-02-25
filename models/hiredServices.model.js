import mongoose from "mongoose";
const { Schema } = mongoose;

const HiredServiceSchema = new Schema(
  {
    serviceId: {
      type: String,
      required: true,
    },
    providerId: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    noHours: {
      type: String,
      required: true,
    },

    Total: {
      type: String,
      required: true,
    },
    review: {
      type: Number,
      required: true,
    },
    
    status: {
      type: String,
      default: 0,
    }
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HiredService", HiredServiceSchema);
