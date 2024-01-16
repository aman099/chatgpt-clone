const PORT = process.env.PORT || 5502;

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// This will allow us to use JSON when we sending something from the Front-end to the Back-end without POST Request
app.use(express.json());
app.use(cors());

// const API_KEY = process.env.API_KEY;
const API_KEY = "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";

app.post("/completions", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: req.body.message,
          //   max_tokens: 100,
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => console.log("Your Server is running on PORT " + PORT));
