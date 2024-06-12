import mongoose, { Schema } from "mongoose";

const groupChatSchema = new Schema({
  name: { type: String, required: true },
  members: { type: [{ type: Schema.Types.ObjectId, ref: "users" }] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  profile: { type: String },
});

const groupChat = mongoose.model("groupChats",groupChatSchema);
export default groupChat;