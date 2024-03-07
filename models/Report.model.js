import mongoose from "mongoose";
const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    senderId: {
      type: String,
      
      required: true,
    },
    senderName: {
        type: String,
        
        required: true,
      },
    text: {
      type: String,
      required: true,
    },
    url:{
        type: String,
        required: false,
    },
  
  
    
  
},
{
    timestamps: true,
  }
);
export default mongoose.model("Report", ReportSchema);
