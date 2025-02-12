import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  createTheme,
  ThemeProvider,
  CssBaseline,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ThemeToggle } from "./components/ThemeToggle";
import { VacationForm } from "./components/VacationForm";
import { VacationGraph } from "./components/VacationGraph";
import { VacationList } from "./components/VacationList";
import axios from "axios";

// Define VacationDay interface if not imported from elsewhere
interface VacationDay {
  id: number;
  date: string; // e.g., "2025-02-12"
  hours: number;
  confirmed: boolean;
}

function App() {
  const currentTheme = useTheme();
  const isMobile = useMediaQuery(currentTheme.breakpoints.down("sm"));
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
      const response = await axios.get(`/api/data`);
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
      const formattedDate = date.toISOString().split("T")[0];
      console.log("Submitting:", { date: formattedDate, hours, confirmed });
      await axios.post(`/api/days`, {
        date: formattedDate,
        hours,
        confirmed,
      });
      await fetchData();
    } catch (error: any) {
      console.error("Error adding vacation day:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleTotalHoursSubmit = async (hours: number) => {
    try {
      await axios.post(`/api/total`, {
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
      console.log("Sending update:", { dayId, confirmed });
      await axios.patch(`/api/days/${dayId}`, { confirmed });
      await fetchData();
    } catch (error) {
      console.error("Error updating confirmation:", error);
    }
  };

  const handleDelete = async (dayId: number) => {
    try {
      await axios.delete(`/api/days/${dayId}`);
      await fetchData();
    } catch (error) {
      console.error("Error deleting vacation day:", error);
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

  // Compute used hours and remaining hours
  const usedHours = vacationDays.reduce(
    (acc: number, day: VacationDay) => acc + day.hours,
    0
  );
  const remainingHours = totalHours - usedHours;
  const remainingDays = Math.floor(remainingHours / 8); // Assuming an 8-hour day

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Position ThemeToggle fixed at the top-right */}
      <ThemeToggle
        isDarkMode={isDarkMode}
        onToggle={handleThemeToggle}
        sx={{
          position: "fixed",
          top: "calc(env(safe-area-inset-top, 0px) + 10px)",
          right: "10px",
          zIndex: 1300,
        }}
      />
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          pt: isMobile ? "calc(env(safe-area-inset-top, 0px) + 100px)" : 2,
          px: isMobile ? 1 : 3,
          py: 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Paper
            elevation={2}
            sx={{
              p: isMobile ? 2 : 3,
              overflow: "auto",
            }}
          >
            <VacationForm
              onSubmit={handleVacationSubmit}
              onTotalHoursSubmit={handleTotalHoursSubmit}
              onConfirmationUpdate={handleConfirmationUpdate}
            />
          </Paper>
        </Box>
        {/* Box to show hours and days remaining */}
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
            Hours Remaining: {remainingHours} | Days Remaining: {remainingDays}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Paper
            elevation={2}
            sx={{
              p: isMobile ? 2 : 3,
              overflow: "auto",
            }}
          >
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
              Vacation Hours Overview
            </Typography>
            <VacationGraph
              totalHours={totalHours}
              vacationDays={vacationDays}
            />
          </Paper>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Paper
            elevation={2}
            sx={{
              p: isMobile ? 2 : 3,
              overflow: "auto",
            }}
          >
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
              Vacation List
            </Typography>
            <VacationList
              vacationDays={vacationDays}
              onConfirmationUpdate={handleConfirmationUpdate}
              onDelete={handleDelete}
            />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
