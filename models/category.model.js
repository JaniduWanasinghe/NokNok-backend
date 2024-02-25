import mongoose from "mongoose";
const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
 
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    scount:{
        type: String,
        required: true,
      }
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", CategorySchema);
