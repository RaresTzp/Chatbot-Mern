import cors from "cors"
import express from "express"
import ImageKit from "imagekit"
import mongoose from "mongoose"
import dotenv from 'dotenv';
import userChats from "./models/userChats.js"
import chat from "./models/chat.js";
import { clerkMiddleware, requireAuth } from '@clerk/express'
dotenv.config();
//require('dotenv').config()

const app = express()
app.use(
    cors({
        origin: "http://localhost:5173", 
        credentials: true
    })
)
app.use(express.json())



//app.get('/', (req, res) => res.json({ msg: "Backend working"}))
const connect = async () => {
    try {

        await mongoose.connect(process.env.MONGO)
        console.log('connected to mongodb')
    } catch(err) {
        console.log(err)
    }
}

const imagekit = new ImageKit ({
    publicKey: 'public_xHcZmyFa54voDkkMLshh5s6Re8c=',
    privateKey: 'private_UkT/y4lkBAK2m6+xs2WZ+CYu6qE=',
    urlEndpoint: 'https://ik.imagekit.io/zoy8itb2r',
})

app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters()
    res.send(result)
})

//app.get("/api/test", requireAuth(), (req, res) => {
    //const userId = req.auth.userId;
    //console.log(userId)
    //res.send("Succes")
//})

app.post("/api/chats", requireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const { text } = req.body; // <-- Destructure userId properly!
  
    try {
      // Create new chat entry
      const newChat = new chat({
        userId: userId,
        history: [{ role: "user", content: [{ text }] }], // <-- Corrected here
      });
  
      const savedChat = await newChat.save();
  
      // Check if user's chat collection already exists
      let existingUserChats = await userChats.findOne({ userId: userId });
  
      if (!existingUserChats) {
        // If user doesn't have any chats, create new document
        const newUserChats = new userChats({
          userId: userId,
          chats: [
            {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          ],
        });
  
        await newUserChats.save();
      } else {
        // If user already exists, update their chats
        await userChats.updateOne(
          { userId: userId },
          {
            $push: {
              chats: {
                _id: savedChat._id,
                title: text.substring(0, 40),
              },
            },
          }
        );
      }
  
      res.status(201).json({ chatId: savedChat._id });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error creating chat!");
    }
  });
  
  app.get("/api/userchats", requireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {

        const userChatsData = await userChats.find({userId})
        res.status(200).send(userChatsData[0].chats);

    } catch (err) {
        console.log(err.message)
        res.status(500).send("Error fetching userchats!")
    }
  })
  

app.listen(process.env.PORT || 5001, () => {
    connect()
    console.log('Server running on PORT 5001')
})