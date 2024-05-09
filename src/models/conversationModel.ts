import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
    members: {
        type: [{ type: Schema.Types.ObjectId, ref: 'users' }],
      required: true,
    },
    isGroup:{
      type:Boolean,
      default:false
    },
    lastMessage: {
        type: String,
    },
  },
  { timestamps: true }
);

const conversation = mongoose.model("conversations",conversationSchema);
export default conversation;