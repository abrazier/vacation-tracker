import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Icon } from "@mdi/react";
import { mdiDelete } from "@mdi/js";
import { format } from "date-fns";
import { VacationDay } from "../types";
import { parseISO } from "date-fns";

interface VacationListProps {
  vacationDays: VacationDay[];
  onConfirmationUpdate: (dayId: number, confirmed: boolean) => Promise<void>;
  onDelete: (dayId: number) => Promise<void>;
}

export function VacationList({
  vacationDays,
  onConfirmationUpdate,
  onDelete,
}: VacationListProps) {
  const sortedDays = [...vacationDays].sort(
    (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Hours</TableCell>
          <TableCell>Confirmed</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedDays.map((day) => (
          <TableRow key={day.id}>
            <TableCell>{format(parseISO(day.date), "MM/dd/yyyy")}</TableCell>
            <TableCell>{day.hours}</TableCell>
            <TableCell>
              <Switch
                checked={day.confirmed}
                onChange={() => onConfirmationUpdate(day.id, !day.confirmed)}
              />
            </TableCell>
            <TableCell>
              <Tooltip title="Delete vacation day">
                <IconButton
                  onClick={() => onDelete(day.id)}
                  color="error"
                  size="small"
                >
                  <Icon path={mdiDelete} size={1} />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
