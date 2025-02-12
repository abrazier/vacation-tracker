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
import { useTheme, useMediaQuery } from "@mui/material";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sortedDays = [...vacationDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedDays.reduce<ChartDataPoint[]>(
    (acc, day, index) => {
      // Calculate total hours used up to this point
      const hoursUsed = sortedDays
        .slice(0, index + 1)
        .reduce((sum, d) => sum + d.hours, 0);

      return [
        ...acc,
        {
          date: format(new Date(day.date), "MM/dd/yyyy"),
          remainingHours: totalHours - hoursUsed,
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
      <g>
        <text
          x={cx}
          y={cy - 10}
          fill="#666"
          textAnchor="middle"
          fontSize={isMobile ? "10" : "12"}
        >
          {payload.remainingHours}
        </text>
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
      </g>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: isMobile ? 300 : 400,
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={
            isMobile
              ? { top: 20, right: 20, left: 0, bottom: 60 }
              : { top: 20, right: 30, left: 20, bottom: 65 }
          }
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={isMobile ? 1 : 0}
          />
          <YAxis
            label={{
              value: "Remaining Hours",
              angle: -90,
              position: "insideLeft",
              offset: isMobile ? -5 : -10,
              style: { fontSize: isMobile ? 10 : 12 },
            }}
            width={isMobile ? 60 : 80}
            tick={{ fontSize: isMobile ? 10 : 12 }}
          />
          <Tooltip wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}
          />
          <Line
            type="monotone"
            dataKey="remainingHours"
            stroke="#8884d8"
            strokeWidth={isMobile ? 1.5 : 2}
            dot={<CustomizedDot />}
            name="Remaining Hours"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
