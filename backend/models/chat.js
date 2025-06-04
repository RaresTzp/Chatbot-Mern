import { text } from "express"
import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    history: [
        {
            role: {
                type: String,
                enum: ["user" , "assistant"],
                required: true
            },

            content: [
                {
                    text: {
                        type: String,
                        required: true
                    },
                }
            ],
            img: {
                type: String,
                required: false
            }
        }
    ]
},
{timestamps: true}
);

export default mongoose.models.chat || mongoose.model("chat", chatSchema);