import mongoose, { Schema } from "mongoose";

const messagesSchema = new Schema({
    conversationId: {
        type: String,
        required: true,
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
  },
  { timestamps: true }
);

const message = mongoose.model("messages",messagesSchema);
export default message;