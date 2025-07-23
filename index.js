const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const questionRoutes = require("./routes/question.routes");
const answerRoutes = require("./routes/answer.routes");
const commentRoutes = require("./routes/comment.routes");
const notificationRoutes = require("./routes/notification.routes");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/notification", notificationRoutes);

app.listen(process.env.PORT || 1313, () => {
	console.log(`Server is running on port ${process.env.PORT || 1313}`);
});
