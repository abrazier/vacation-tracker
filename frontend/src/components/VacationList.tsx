import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
} from "@mui/material";
import { format } from "date-fns";
import { VacationDay } from "../types";

interface VacationListProps {
  vacationDays: VacationDay[];
  onConfirmationUpdate: (dayId: number, confirmed: boolean) => void;
}

export function VacationList({
  vacationDays,
  onConfirmationUpdate,
}: VacationListProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Hours</TableCell>
          <TableCell>Confirmed</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {vacationDays.map((day) => (
          <TableRow key={`${day.date}-${day.id}`}>
            <TableCell>{format(new Date(day.date), "MM/dd/yyyy")}</TableCell>
            <TableCell>{day.hours}</TableCell>
            <TableCell>
              <Switch
                checked={day.confirmed}
                onChange={() => onConfirmationUpdate(day.id, !day.confirmed)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
