import mongoose, { Schema } from "mongoose";

const groupMessagesSchema = new Schema(
  {
    groupId: { type: Schema.Types.ObjectId, ref: "groupChats", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "users", required: true },
    text: { type: String },
  },
  { timestamps: true }
);

const groupMessage = mongoose.model("groupMessages", groupMessagesSchema);
export default groupMessage;
