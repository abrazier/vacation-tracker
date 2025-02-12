import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Stack, 
  FormControlLabel, 
  Switch 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

interface VacationFormProps {
  onSubmit: (date: Date, hours: number, confirmed: boolean) => void;
  onTotalHoursSubmit: (hours: number) => void;
}

export function VacationForm({ onSubmit, onTotalHoursSubmit }: VacationFormProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [hours, setHours] = useState<number>(8);
  const [confirmed, setConfirmed] = useState(false);
  const [totalHours, setTotalHours] = useState<number>(0);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Total Vacation Hours for Year"
          type="number"
          value={totalHours}
          onChange={(e) => setTotalHours(Number(e.target.value))}
          sx={{ width: 200 }}
        />
        <Button 
          variant="contained" 
          onClick={() => onTotalHoursSubmit(totalHours)}
        >
          Set Total Hours
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <DatePicker
          label="Vacation Date"
          value={date}
          onChange={(newDate) => setDate(newDate)}
          sx={{ width: 200 }}
        />
        <TextField
          label="Hours"
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          inputProps={{ min: 0, max: 24 }}
          sx={{ width: 100 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
          }
          label="Confirmed"
        />
        <Button
          variant="contained"
          onClick={() => date && onSubmit(date, hours, confirmed)}
          disabled={!date}
        >
          Add Vacation Day
        </Button>
      </Stack>
    </Stack>
  );
}