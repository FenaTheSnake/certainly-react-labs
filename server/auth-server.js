const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const DB_PATH = "./db.json";

const readUsers = () => {
  const raw = fs.readFileSync(DB_PATH);
  const data = JSON.parse(raw);
  return data.users || [];
};

const writeUsers = (users) => {
  const raw = fs.readFileSync(DB_PATH);
  const data = JSON.parse(raw);
  const newData = { ...data, users };
  fs.writeFileSync(DB_PATH, JSON.stringify(newData, null, 2));
};

// Feedbacks
const readFeedbacks = () => {
  const raw = fs.readFileSync(DB_PATH);
  const data = JSON.parse(raw);
  return data.feedbacks || [];
};

const writeFeedbacks = (feedbacks) => {
  const raw = fs.readFileSync(DB_PATH);
  const data = JSON.parse(raw);
  const newData = { ...data, feedbacks };
  fs.writeFileSync(DB_PATH, JSON.stringify(newData, null, 2));
};

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    return res.json({ success: true, message: "Login successful" });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const userExists = users.find((u) => u.email === email);
  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const newUser = { email, password };
  newUser.about = "Hello!";
  users.push(newUser);
  writeUsers(users);

  return res.status(201).json({ success: true, message: "User registered" });
});

// Получить информацию о пользователе по email
app.get("/user/:email", (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.email === req.params.email);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Вернём только email и about (без пароля)
  const { email, about = "" } = user;
  res.json({ success: true, user: { email, about } });
});

// Обновить поле "О себе"
app.put("/user/:email", (req, res) => {
  const users = readUsers();
  const userIndex = users.findIndex((u) => u.email === req.params.email);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const { about } = req.body;
  users[userIndex].about = about;

  writeUsers(users);
  res.json({ success: true, message: "User updated", user: users[userIndex] });
});


app.post("/logout", (req, res) => {
  return res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


// feedback


app.get("/feedbacks", (req, res) => {
  const feedbacks = readFeedbacks();
  res.json(feedbacks);
});

// Добавить новый отзыв
app.post("/feedbacks", (req, res) => {
  const { author, content } = req.body;
  if (!author || !content) {
    return res.status(400).json({ message: "Missing author or content" });
  }

  const feedbacks = readFeedbacks();
  const newFeedback = {
    id: feedbacks.length > 0 ? feedbacks[feedbacks.length - 1].id + 1 : 1,
    author,
    content,
  };

  feedbacks.push(newFeedback);
  writeFeedbacks(feedbacks);

  res.status(201).json({ message: "Feedback added", feedback: newFeedback });
});

app.delete("/feedbacks/:id", (req, res) => {
  const feedbackId = parseInt(req.params.id);
  if (isNaN(feedbackId)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const feedbacks = readFeedbacks();
  const index = feedbacks.findIndex(f => f.id === feedbackId);

  if (index === -1) {
    return res.status(404).json({ message: "Feedback not found" });
  }

  const removed = feedbacks.splice(index, 1);
  writeFeedbacks(feedbacks);

  res.json({ message: "Feedback deleted", deleted: removed[0] });
});