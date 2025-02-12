import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { VacationForm } from './components/VacationForm';
import { VacationGraph } from './components/VacationGraph';
import axios from 'axios';

interface VacationDay {
  date: string;
  hours: number;
  confirmed: boolean;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function App() {
  const [totalHours, setTotalHours] = useState(0);
  const [vacationDays, setVacationDays] = useState<VacationDay[]>([]);

  useEffect(() => {
    fetchData();
  }, []); // Add empty dependency array

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/data`);
      setTotalHours(response.data.total_hours);
      setVacationDays(response.data.vacation_days);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleVacationSubmit = async (date: Date, hours: number, confirmed: boolean) => {
    try {
      await axios.post(`${API_URL}/api/days`, {
        date: date.toISOString().split('T')[0],
        hours,
        confirmed
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      fetchData();
    } catch (error) {
      console.error('Error adding vacation day:', error);
    }
  };

  const handleTotalHoursSubmit = async (hours: number) => {
    try {
      await axios.post(`${API_URL}/api/total`, {
        total_hours: hours
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      fetchData();
    } catch (error) {
      console.error('Error setting total hours:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Vacation Tracker
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <VacationForm
            onSubmit={handleVacationSubmit}
            onTotalHoursSubmit={handleTotalHoursSubmit}
          />
        </Paper>
      </Box>
      <Paper elevation={2} sx={{ p: 3 }}>
        <VacationGraph
          totalHours={totalHours}
          vacationDays={vacationDays}
        />
      </Paper>
    </Container>
  );
}

export default App;