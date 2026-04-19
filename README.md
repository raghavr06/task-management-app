# 📋 MERN Task Management App

A simple full-stack task management application built with the MERN stack.

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas (via Mongoose)

---

## Project Structure

```
TASK MANAGEMENT/
├── backend/
│   ├── models/
│   │   └── Task.js          # Mongoose Task schema
│   ├── routes/
│   │   └── tasks.js         # CRUD API routes
│   ├── .env                 # ← You must create this (see below)
│   ├── .env.example         # Template for .env
│   ├── package.json
│   └── server.js            # Express server entry point
└── frontend/
    ├── src/
    │   ├── App.js            # All React UI (create / read / update / delete)
    │   └── App.css           # Styling
    └── package.json
```

---

## ⚙️ Setup & Run Locally

### Step 1 — Prerequisites
Make sure you have:
- [Node.js](https://nodejs.org/) v16+ installed
- A [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster

---

### Step 2 — Configure the Backend `.env`

1. Inside the `backend/` folder, create a file named `.env`
2. Copy the contents of `.env.example` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
```

> Replace `<username>`, `<password>`, and the cluster URL with your actual MongoDB Atlas credentials.

---

### Step 3 — Start the Backend

```bash
cd backend
npm install        # (already done if you cloned this)
npm run dev        # uses nodemon for auto-restart
# or
npm start          # plain node
```

The server will start at **http://localhost:5000**

---

### Step 4 — Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm start
```

The React app will start at **http://localhost:3000**

---

## 🌐 API Endpoints

| Method | URL              | Description         |
|--------|------------------|---------------------|
| GET    | `/tasks`         | Get all tasks       |
| POST   | `/tasks`         | Create a new task   |
| PUT    | `/tasks/:id`     | Update a task       |
| DELETE | `/tasks/:id`     | Delete a task       |

### POST / PUT Request Body (JSON)
```json
{
  "title": "My Task",
  "description": "Details here",
  "completed": false
}
```

---

## ✅ Features
- Create tasks with a title and optional description  
- View all tasks in a clean card list  
- Mark tasks as complete / incomplete (checkbox)  
- Edit any task title or description (modal dialog)  
- Delete tasks with a confirmation prompt  
