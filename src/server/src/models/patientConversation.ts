import mongoose from "mongoose";

const patientConversationSchema = new mongoose.Schema(
	{
        ping:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ping",
        }],
       
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",  
				default: [],
			},
		],
	},
	{ timestamps: true }
);

const PatientConversation = mongoose.model("PatientConversation", patientConversationSchema);

export default PatientConversation;