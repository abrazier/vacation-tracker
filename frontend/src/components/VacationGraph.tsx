import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';
import { Box, Typography } from '@mui/material';

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

export function VacationGraph({ totalHours, vacationDays }: VacationGraphProps) {
  const sortedDays = [...vacationDays].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedDays.reduce<ChartDataPoint[]>((acc, day, index) => {
    const previousHours = index > 0 ? acc[index - 1].remainingHours : totalHours;
    return [...acc, {
      date: format(new Date(day.date), 'MM/dd/yyyy'),
      remainingHours: previousHours - day.hours,
      confirmed: day.confirmed
    }];
  }, [{
    date: 'Start',
    remainingHours: totalHours,
    confirmed: true
  }]);

  if (chartData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No vacation days added yet
        </Typography>
      </Box>
    );
  }

  const CustomizedLine = (props: { points: Array<{ x: number; y: number }> }) => {
    const { points } = props;
    return (
      <g>
        {points.map((point, index) => {
          if (index === 0) return null;
          const previousPoint = points[index - 1];
          const isConfirmed = chartData[index].confirmed;
          
          return (
            <g key={index}>
              <line
                x1={previousPoint.x}
                y1={previousPoint.y}
                x2={point.x}
                y2={point.y}
                stroke="#1976d2"
                strokeWidth={2}
                strokeDasharray={isConfirmed ? "0" : "5 5"}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r={4}
                fill="#1976d2"
                stroke="none"
              />
            </g>
          );
        })}
        {points[0] && (
          <circle
            cx={points[0].x}
            cy={points[0].y}
            r={4}
            fill="#1976d2"
            stroke="none"
          />
        )}
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis 
          domain={[0, totalHours]} 
          label={{ value: 'Remaining Hours', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="remainingHours"
          name="Remaining Hours"
          stroke="#1976d2"
          strokeWidth={2}
          dot={false}
          connectNulls
          // @ts-ignore - shape prop exists but is not properly typed in recharts
          shape={<CustomizedLine />}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}