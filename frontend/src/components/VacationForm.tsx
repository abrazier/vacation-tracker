import { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

interface VacationFormProps {
  onSubmit: (date: Date, hours: number, confirmed: boolean) => Promise<void>;
  onTotalHoursSubmit: (hours: number) => Promise<void>;
  onConfirmationUpdate: (dayId: number, confirmed: boolean) => Promise<void>;
}

export function VacationForm({
  onSubmit,
  onTotalHoursSubmit,
  onConfirmationUpdate,
}: VacationFormProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [hours, setHours] = useState<number>(8);
  const [confirmed, setConfirmed] = useState(false);
  const [totalHours, setTotalHours] = useState<number>(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack spacing={3}>
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 1 : 2}
        alignItems="center"
      >
        <TextField
          fullWidth={isMobile}
          label="Total Vacation Hours for Year"
          type="number"
          value={totalHours}
          onChange={(e) => setTotalHours(Number(e.target.value))}
          sx={{ width: isMobile ? "100%" : 200 }}
        />
        <Button
          variant="contained"
          onClick={() => onTotalHoursSubmit(totalHours)}
          fullWidth={isMobile}
        >
          Set Total Hours
        </Button>
      </Stack>

      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 1 : 2}
        alignItems="center"
      >
        <DatePicker
          label="Vacation Date"
          value={date}
          onChange={(newDate) => setDate(newDate)}
          sx={{ width: isMobile ? "100%" : 200 }}
        />
        <TextField
          fullWidth={isMobile}
          label="Hours"
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          inputProps={{ min: 0, max: 24 }}
          sx={{ width: isMobile ? "100%" : 100 }}
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
          fullWidth={isMobile}
        >
          Add Vacation Day
        </Button>
      </Stack>
    </Stack>
  );
}
