import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";

import api from "../services/api";

function Allocation() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [summary, setSummary] = useState({
    total_students: 0,
    allocated_students: 0,
    unallocated_students: 0,
  });

  useEffect(() => {
    loadStudents();
    loadSummary();
  }, []);

  const loadStudents = async () => {
    const res = await api.get("/dashboard/allocated-students");
    setStudents(res.data);
  };

  const loadSummary = async () => {
    const res = await api.get("/dashboard/summary");
    setSummary(res.data);
  };

  const processAllocation = async () => {
    setLoading(true);

    await api.post("/allocation/");

    await loadStudents();
    await loadSummary();

    setLoading(false);
    setOpen(true);
  };

  return (
    <div style={{ padding: 30 }}>
      <Typography variant="h4" gutterBottom align="center">
        Student Allocation
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Allocated Students</Typography>
              <Typography variant="h4">
                {summary.allocated_students}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Unallocated Students</Typography>
              <Typography variant="h4">
                {summary.unallocated_students}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Students</Typography>
              <Typography variant="h4">
                {summary.total_students}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={processAllocation}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? "Allocating..." : "Run Allocation"}
      </Button>

      <Card>
        <CardContent>

          {students.length === 0 ? (
            <Typography align="center" sx={{ p: 3 }}>
              No students have been allocated yet.
            </Typography>
          ) : (

            <Table>

              <TableHead>
                <TableRow>
                  <TableCell><b>Student ID</b></TableCell>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Allocated Course</b></TableCell>
                  <TableCell><b>Preference</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>

                {students.map((student: any) => (

                  <TableRow key={student.student_id} hover>

                    <TableCell>{student.student_id}</TableCell>

                    <TableCell>{student.student_name}</TableCell>

                    <TableCell>{student.course}</TableCell>

                    <TableCell>
                      <Chip
                        label={
                          student.priority === 1
                            ? "First Preference"
                            : student.priority === 2
                            ? "Second Preference"
                            : "Third Preference"
                        }
                        color={
                          student.priority === 1
                            ? "success"
                            : student.priority === 2
                            ? "warning"
                            : "error"
                        }
                      />
                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          )}

        </CardContent>
      </Card>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert
          severity="success"
          variant="filled"
        >
          Allocation completed successfully!
        </Alert>
      </Snackbar>

    </div>
  );
}

export default Allocation;