import express from "express"
import { protectRoute } from "../middlewares/auth.js"
import { getMessages, getUsersforSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js"


const messageRouter=express.Router()

messageRouter.get("/users",protectRoute,getUsersforSidebar)
messageRouter.get("/:id",protectRoute,getMessages)
messageRouter.put("/mark/:id",protectRoute,markMessageAsSeen) // to update the data

messageRouter.post("/send/:id",protectRoute,sendMessage)

export default messageRouter;