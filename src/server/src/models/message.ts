import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Hospital",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Hospital",
			required: true,
		},
		message: {
			type: String,
			required: true,
		},

	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;