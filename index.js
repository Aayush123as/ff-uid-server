const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("My Free Fire UID API is running!");
});

app.get("/check", async (req, res) => {
  const { uid, region = "BD" } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "Please provide a UID" });
  }

  try {
    const response = await fetch(`https://onrender.com{region}&uid=${uid}`);
    const data = await response.json();

    if (data && data.basicInfo && data.basicInfo.nickname) {
      return res.json({
        success: true,
        uid: uid,
        nickname: data.basicInfo.nickname,
        level: data.basicInfo.level,
        region: data.basicInfo.region
      });
    } else {
      return res.status(404).json({ success: false, message: "Player not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Upstream server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
