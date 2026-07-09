import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";

import api from "../services/api";
import CourseChart from "../components/CourseChart";

function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [statistics, setStatistics] = useState<any[]>([]);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const summaryResponse = await api.get("/dashboard/summary");
      setSummary(summaryResponse.data);

      const statsResponse = await api.get("/dashboard/course-statistics");
      setStatistics(statsResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!summary) {
    return (
      <div style={{ marginTop: 30, textAlign: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Students</Typography>
              <Typography variant="h4">
                {summary.total_students}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Courses</Typography>
              <Typography variant="h4">
                {summary.total_courses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Allocated Students</Typography>
              <Typography variant="h4">
                {summary.allocated_students}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Unallocated Students</Typography>
              <Typography variant="h4">
                {summary.unallocated_students}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Course Allocation Statistics
          </Typography>

          <CourseChart data={statistics} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;