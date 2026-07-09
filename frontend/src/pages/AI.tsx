import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";

import api from "../services/api";

interface Message {
  sender: "user" | "ai";
  text: string;
}

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  const askAI = async () => {
    if (!question.trim()) return;

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", {
        question: userQuestion,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.data.answer,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Unable to get response from AI.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 30 }}>
      <Typography variant="h4" gutterBottom>
        AI Assistant
      </Typography>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Ask about allocations, courses or students..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askAI();
              }
            }}
          />

          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={askAI}
              disabled={loading}
            >
              {loading ? "Thinking..." : "Ask AI"}
            </Button>

            <Button
              color="error"
              variant="outlined"
              onClick={() => setMessages([])}
            >
              Clear Chat
            </Button>
          </Box>

          {loading && (
            <Box sx={{ mt: 3 }}>
              <CircularProgress />
            </Box>
          )}

          <Box
            sx={{
              mt: 4,
              maxHeight: 450,
              overflowY: "auto",
            }}
          >
            {messages.map((msg, index) => (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  bgcolor:
                    msg.sender === "user"
                      ? "#e3f2fd"
                      : "#f5f5f5",
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold" }}
                  >
                    {msg.sender === "user"
                      ? "You"
                      : "AI Assistant"}
                  </Typography>

                  <Typography
                    sx={{ whiteSpace: "pre-line" }}
                  >
                    {msg.text}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIAssistant;