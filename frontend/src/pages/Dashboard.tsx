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
import CategoryChart from "../components/CategoryChart";
import SeatUtilizationChart from "../components/SeatUtilizationChart";
import RejectionRateChart from "../components/RejectionRateChart";

function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [statistics, setStatistics] = useState<any[]>([]);
  const [category, setCategory] = useState<any[]>([]);
  const [seatUtilization, setSeatUtilization] = useState<any[]>([]);
  const [rejectionRate, setRejectionRate] = useState<any[]>([]);
  const [firstPreference, setFirstPreference] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const summaryResponse = await api.get("/dashboard/summary");
      setSummary(summaryResponse.data);

      const statsResponse = await api.get("/dashboard/course-statistics");
      setStatistics(statsResponse.data);

      const categoryResponse = await api.get("/dashboard/category-summary");
      setCategory(categoryResponse.data);

      const seatResponse = await api.get("/dashboard/seat-utilization");
      setSeatUtilization(seatResponse.data);

      const rejectionResponse = await api.get("/dashboard/rejection-rate");
      setRejectionRate(rejectionResponse.data);

      const preferenceResponse = await api.get("/dashboard/first-preference");
      setFirstPreference(preferenceResponse.data);

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

        <Grid size={{ xs: 12, md: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Students</Typography>
              <Typography variant="h4">{summary.total_students}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Courses</Typography>
              <Typography variant="h4">{summary.total_courses}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Allocated</Typography>
              <Typography variant="h4">{summary.allocated_students}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Unallocated</Typography>
              <Typography variant="h4">{summary.unallocated_students}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Allocation %</Typography>
              <Typography variant="h4">
                {summary.allocation_percentage}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">1st Preference</Typography>
              <Typography variant="h4">
                {firstPreference?.success_rate ?? 0}%
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

      <Card sx={{ mt: 4 }}>
        <CardContent>

          <Typography variant="h6" gutterBottom>
            Category-wise Allocation
          </Typography>

          <CategoryChart data={category} />

        </CardContent>
      </Card>

      <Card sx={{ mt: 4 }}>
        <CardContent>

          <Typography variant="h6" gutterBottom>
            Seat Utilization
          </Typography>

          <SeatUtilizationChart data={seatUtilization} />

        </CardContent>
      </Card>

      <Card sx={{ mt: 4 }}>
        <CardContent>

          <Typography variant="h6" gutterBottom>
            Rejection Rate
          </Typography>

          <RejectionRateChart data={rejectionRate} />

        </CardContent>
      </Card>

    </div>
  );
}

export default Dashboard;