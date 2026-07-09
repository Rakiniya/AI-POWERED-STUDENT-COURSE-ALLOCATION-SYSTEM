import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function SeatUtilizationChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="course" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="utilization" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SeatUtilizationChart;