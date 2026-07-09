import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function CourseChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="course" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="allocated_students" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CourseChart;