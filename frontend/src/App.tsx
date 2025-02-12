import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { ThemeToggle } from "./components/ThemeToggle";
import { VacationForm } from "./components/VacationForm";
import { VacationGraph } from "./components/VacationGraph";
import { VacationList } from "./components/VacationList";
import { VacationDay } from "./types";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [totalHours, setTotalHours] = useState(0);
  const [vacationDays, setVacationDays] = useState<VacationDay[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/data`);
      console.log("API Response:", response.data);
      setTotalHours(response.data.total_hours);
      setVacationDays(response.data.vacation_days);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleVacationSubmit = async (
    date: Date,
    hours: number,
    confirmed: boolean
  ) => {
    try {
      await axios.post(`${API_URL}/api/days`, {
        date: date.toISOString().split("T")[0],
        hours,
        confirmed,
      });
      fetchData();
    } catch (error) {
      console.error("Error adding vacation day:", error);
    }
  };

  const handleTotalHoursSubmit = async (hours: number) => {
    try {
      await axios.post(`${API_URL}/api/total`, {
        total_hours: hours,
      });
      fetchData();
    } catch (error) {
      console.error("Error setting total hours:", error);
    }
  };

  const handleConfirmationUpdate = async (
    dayId: number,
    confirmed: boolean
  ) => {
    try {
      await axios.patch(`${API_URL}/api/days/${dayId}`, { confirmed });
      await fetchData();
    } catch (error) {
      console.error("Error updating confirmation:", error);
    }
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  const handleThemeToggle = () => {
    setIsDarkMode((prev: boolean) => {
      const newValue = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newValue));
      return newValue;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ position: "relative" }}>
        <ThemeToggle isDarkMode={isDarkMode} onToggle={handleThemeToggle} />

        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Vacation Tracker
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <VacationForm
              onSubmit={handleVacationSubmit}
              onTotalHoursSubmit={handleTotalHoursSubmit}
              onConfirmationUpdate={handleConfirmationUpdate}
            />
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Vacation Hours Overview
            </Typography>
            <VacationGraph
              totalHours={totalHours}
              vacationDays={vacationDays}
            />
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Vacation Days List
            </Typography>
            <VacationList
              vacationDays={vacationDays}
              onConfirmationUpdate={handleConfirmationUpdate}
            />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
