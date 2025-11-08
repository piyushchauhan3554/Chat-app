# 💬 Chat App

A **real-time chat application** built using **React.js**, **Node.js**, **Express.js**, and **MongoDB**, enabling seamless communication between users with real-time message updates via **WebSockets (Socket.io)**.  

---

## 🚀 Features

- 🔐 **User Authentication** (Signup/Login with JWT)
- 💬 **Real-time messaging** using **Socket.IO**
- 👥 **Online/Offline user status**
- 🖼️ **Image upload support** (via **Cloudinary**)
- 📱 **Responsive UI** built with **Tailwind CSS**
- ⚡ **Fast backend APIs** using **Express.js**
- 🧠 **State management** with React Context API

---

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS, Context API, Axios  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.IO  
**Authentication:** JSON Web Token (JWT)  
**Media Storage:** Cloudinary  
**Tools:** Postman, Git & GitHub  

---

## ⚙️ Setup & Run Locally

```bash
# 1️⃣ Clone the repository
git clone https://github.com/piyushchauhan3554/Chat-app.git
cd Chat-app

# 2️⃣ Install dependencies
cd client
npm install
cd ../server
npm install

# 3️⃣ Setup environment variables
# Create a .env file inside the 'server' folder and add:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# CLOUDINARY_URL=your_cloudinary_url

# 4️⃣ Run the Application
# Start backend
cd server
npm start &

# Start frontend
cd ../client
npm run dev
