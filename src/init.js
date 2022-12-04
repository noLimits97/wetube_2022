import "dotenv/config"; // .env를 읽을 수 있게 한다.
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4001;

const handleListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT} 🌏`);
app.listen(PORT, handleListening);
