import user from "../models/user.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";
// function to get all the users except the logged in user

export const getUsersforSidebar = async (req, res) => {
  try {
    const userId = req.user._id; // humari id
    const filteredUsers = await user
      .find({ _id: { $ne: userId } })
      .select("-password");

    // count the no. of unseen messages

    const unseenMessages = {}; // key:val
    // key: id , val:no. of messages

    const promises = filteredUsers.map(async (usr) => {
      const msg = await Message.find({
        senderId: usr._id, // sender koi aur ho
        receiverId: userId, //receiver hum ho
        seen: false, // msg unseen ho
      });

      if (msg.length > 0) {
        unseenMessages[usr._id] = msg.length;
      }
    });

    await Promise.all(promises);
    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// function :- get all the messages of the selected user

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: selectedUserId,
        },
        {
          senderId: selectedUserId,
          receiverId: myId,
        },
      ],
    });

    // mark the messages as seen :- when we open any chat or select any user
    await Message.updateMany(
      {
        senderId: selectedUserId,
        receiverId: myId,
      },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// function to mark message as seen using message id

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, {
      seen: true,
    });
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// function of send message to selected user

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    // emit the new message to the receiver's socket

    const receiverSocketSet = userSocketMap[receiverId];
    if (receiverSocketSet) {
      // emit to every socket id for that user
      for (const sockId of receiverSocketSet) {
        io.to(sockId).emit("newMessage", newMessage);
      }
    }
    // optionally emit to sender sockets as well (so other open tabs update)
    const senderSocketSet = userSocketMap[senderId];
    if (senderSocketSet) {
      for (const sockId of senderSocketSet) {
        io.to(sockId).emit("newMessage", newMessage);
      }
    }
    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
