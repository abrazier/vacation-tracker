import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Box, Typography } from "@mui/material";

interface VacationDay {
  date: string;
  hours: number;
  confirmed: boolean;
}

interface VacationGraphProps {
  totalHours: number;
  vacationDays: VacationDay[];
}

interface ChartDataPoint {
  date: string;
  remainingHours: number;
  confirmed: boolean;
}

export function VacationGraph({
  totalHours,
  vacationDays,
}: VacationGraphProps) {
  const sortedDays = [...vacationDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedDays.reduce<ChartDataPoint[]>(
    (acc, day, index) => {
      const previousHours =
        index > 0 ? acc[index - 1].remainingHours : totalHours;
      return [
        ...acc,
        {
          date: format(new Date(day.date), "MM/dd/yyyy"),
          remainingHours: previousHours - day.hours,
          confirmed: day.confirmed,
        },
      ];
    },
    [
      {
        date: "Start",
        remainingHours: totalHours,
        confirmed: true,
      },
    ]
  );

  if (chartData.length === 1 && chartData[0].date === "Start") {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No vacation days added yet
        </Typography>
      </Box>
    );
  }

  const CustomizedDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <svg x={cx - 6} y={cy - 6} width={12} height={12}>
        <circle
          cx="6"
          cy="6"
          r="5"
          fill="#8884d8"
          stroke="#8884d8"
          strokeWidth="2"
          strokeDasharray={payload.confirmed ? "0" : "2 2"}
        />
      </svg>
    );
  };

  return (
    <Box sx={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 65 }} // Added margin
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60} // Added height for X-axis
          />
          <YAxis
            label={{
              value: "Remaining Hours",
              angle: -90,
              position: "insideLeft",
              offset: -10, // Adjusted label position
            }}
            width={80} // Added width for Y-axis
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="remainingHours"
            stroke="#8884d8"
            strokeWidth={2}
            dot={<CustomizedDot />}
            name="Remaining Hours"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
