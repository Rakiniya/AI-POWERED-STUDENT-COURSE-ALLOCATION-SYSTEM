import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function RejectionRateChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="course" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="rejection_rate" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default RejectionRateChart;