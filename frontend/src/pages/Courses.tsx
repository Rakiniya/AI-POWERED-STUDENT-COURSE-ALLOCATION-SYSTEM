import { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  Box,
  Chip,
  Button,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

import api from "../services/api";

function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [courseName, setCourseName] = useState("");
  const [totalSeats, setTotalSeats] = useState(0);
  const [generalSeats, setGeneralSeats] = useState(0);
  const [obcSeats, setObcSeats] = useState(0);
  const [scSeats, setScSeats] = useState(0);
  const [stSeats, setStSeats] = useState(0);

  const [openSnackbar, setOpenSnackbar] = useState(false);
const [message, setMessage] = useState("");
const [severity, setSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await api.get("/courses/");
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setCourseName("");
    setTotalSeats(0);
    setGeneralSeats(0);
    setObcSeats(0);
    setScSeats(0);
    setStSeats(0);
  };

  const saveCourse = async () => {
    const payload = {
      course_name: courseName,
      total_seats: Number(totalSeats),
      general_seats: Number(generalSeats),
      obc_seats: Number(obcSeats),
      sc_seats: Number(scSeats),
      st_seats: Number(stSeats),
    };

    try {
      if (editingId === null) {
        await api.post("/courses/", payload);
        setMessage("Course added successfully.");
setSeverity("success");
setOpenSnackbar(true);
      } else {
        await api.put(`/courses/${editingId}`, payload);

        setMessage("Course updated successfully.");
setSeverity("success");
setOpenSnackbar(true);
      }

      clearForm();
      loadCourses();
    } catch (error) {
      console.error(error);
      setMessage("Operation failed.");
setSeverity("error");
setOpenSnackbar(true);
    }
  };

  const editCourse = (course: any) => {
    setEditingId(course.id);
    setCourseName(course.course_name);
    setTotalSeats(course.total_seats);
    setGeneralSeats(course.general_seats);
    setObcSeats(course.obc_seats);
    setScSeats(course.sc_seats);
    setStSeats(course.st_seats);
  };

  const deleteCourse = async (id: number) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await api.delete(`/courses/${id}`);
      setMessage("Course deleted successfully.");
setSeverity("success");
setOpenSnackbar(true);
      loadCourses();
    } catch (error) {
      console.error(error);
      alert("Delete failed.");
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.course_name.toLowerCase().includes(search.toLowerCase())
  );

  <Snackbar
  open={openSnackbar}
  autoHideDuration={3000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
>
  <Alert
    severity={severity}
    onClose={() => setOpenSnackbar(false)}
    variant="filled"
  >
    {message}
  </Alert>
</Snackbar>

  return (
    <div style={{ padding: 30 }}>
      <Typography variant="h4" gutterBottom>
        Courses
      </Typography>

      <Typography color="text.secondary" gutterBottom>
        Total Courses: {courses.length}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? "Update Course" : "Add Course"}
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Total Seats"
              value={totalSeats}
              onChange={(e) => setTotalSeats(Number(e.target.value))}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="General"
              value={generalSeats}
              onChange={(e) => setGeneralSeats(Number(e.target.value))}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="OBC"
              value={obcSeats}
              onChange={(e) => setObcSeats(Number(e.target.value))}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="SC"
              value={scSeats}
              onChange={(e) => setScSeats(Number(e.target.value))}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="ST"
              value={stSeats}
              onChange={(e) => setStSeats(Number(e.target.value))}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button variant="contained" onClick={saveCourse}>
              {editingId ? "Update Course" : "Add Course"}
            </Button>

            {editingId && (
              <Button
                sx={{ ml: 2 }}
                variant="outlined"
                onClick={clearForm}
              >
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <TextField
          label="Search Course"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />

        <Button variant="contained" onClick={loadCourses}>
          Refresh
        </Button>
      </Box>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Course</b></TableCell>
              <TableCell><b>Total</b></TableCell>
              <TableCell><b>General</b></TableCell>
              <TableCell><b>OBC</b></TableCell>
              <TableCell><b>SC</b></TableCell>
              <TableCell><b>ST</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id} hover>
                <TableCell>{course.course_name}</TableCell>
                <TableCell>{course.total_seats}</TableCell>
                <TableCell>{course.general_seats}</TableCell>
                <TableCell>{course.obc_seats}</TableCell>
                <TableCell>{course.sc_seats}</TableCell>
                <TableCell>{course.st_seats}</TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => editCourse(course)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={{ ml: 1 }}
                    onClick={() => deleteCourse(course.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {filteredCourses.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default Courses;