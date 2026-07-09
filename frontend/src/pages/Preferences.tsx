import { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

import api from "../services/api";

function Preferences() {
  const [preferences, setPreferences] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [priority, setPriority] = useState("");

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const pref = await api.get("/preferences/");
      const stu = await api.get("/students/");
      const cou = await api.get("/courses/");

      setPreferences(pref.data);
      setStudents(stu.data);
      setCourses(cou.data);
    } catch (error) {
      console.error(error);
    }
  };

  const savePreference = async () => {

  if (!studentId || !courseId || !priority) {
    setSeverity("error");
    setMessage("Please fill all fields.");
    setOpenSnackbar(true);
    return;
  }

  try {

    const payload = {
      student_id: Number(studentId),
      course_id: Number(courseId),
      priority: Number(priority),
    };

    if (editId) {

      await api.put(`/preferences/${editId}`, payload);

      setSeverity("success");
      setMessage("Preference updated successfully.");

    } else {

      await api.post("/preferences/", payload);

      setSeverity("success");
      setMessage("Preference added successfully.");
    }

    setOpenSnackbar(true);

    setStudentId("");
    setCourseId("");
    setPriority("");
    setEditId(null);

    loadData();

  } catch (err: any) {

    setSeverity("error");

    if (err.response?.data?.detail) {
      setMessage(err.response.data.detail);
    } else {
      setMessage("Operation failed.");
    }

    setOpenSnackbar(true);
  }
};

  const deletePreference = async (id: number) => {
    if (!window.confirm("Delete this preference?")) return;

    try {
      await api.delete(`/preferences/${id}`);

      loadData();

      setSeverity("success");
      setMessage("Preference deleted successfully.");
      setOpenSnackbar(true);

    } catch {
      setSeverity("error");
      setMessage("Delete failed.");
      setOpenSnackbar(true);
    }
  };

  const editPreference = (pref: any) => {

  setEditId(pref.id);

  setStudentId(pref.student_id.toString());

  setCourseId(pref.course_id.toString());

  setPriority(pref.priority.toString());

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

};

  const filteredPreferences = preferences.filter((pref) => {
    const student = students.find((s: any) => s.id === pref.student_id);

    return (
      student &&
      student.name.toLowerCase().includes(search.toLowerCase())
    );
  });

    return (
    <div style={{ padding: 30 }}>
      <Typography variant="h4" gutterBottom>
        Student Preferences
      </Typography>

      <Typography color="text.secondary" gutterBottom>
        Total Preferences: {preferences.length}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add Preference
        </Typography>

        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Student"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
              {students.map((student: any) => (
                <MenuItem
                  key={student.id}
                  value={student.id}
                >
                  {student.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {courses.map((course: any) => (
                <MenuItem
                  key={course.id}
                  value={course.id}
                >
                  {course.course_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              select
              fullWidth
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="1">Priority 1</MenuItem>
              <MenuItem value="2">Priority 2</MenuItem>
              <MenuItem value="3">Priority 3</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: 55 }}
              onClick={savePreference}
            >
              {editId ? "Update" : "Save"}
            </Button>

            {editId && (
  <Grid size={{ xs: 12, md: 2 }}>
    <Button
      fullWidth
      color="secondary"
      variant="outlined"
      sx={{ height: 55 }}
      onClick={() => {
        setEditId(null);
        setStudentId("");
        setCourseId("");
        setPriority("");
      }}
    >
      Cancel
    </Button>
  </Grid>
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
          label="Search Student"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />

        <Button
          variant="contained"
          onClick={loadData}
        >
          Refresh
        </Button>
      </Box>

      <Paper elevation={3}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell><b>Student</b></TableCell>
              <TableCell><b>Course</b></TableCell>
              <TableCell><b>Priority</b></TableCell>
              <TableCell align="center"><b>Action</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {filteredPreferences.length === 0 ? (

              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                >
                  No Preferences Found
                </TableCell>
              </TableRow>

            ) : (

              filteredPreferences.map((pref: any) => {

                const student = students.find(
                  (s: any) => s.id === pref.student_id
                );

                const course = courses.find(
                  (c: any) => c.id === pref.course_id
                );

                return (
                  <TableRow
                    key={pref.id}
                    hover
                  >
                    <TableCell>
                      {student?.name}
                    </TableCell>

                    <TableCell>
                      {course?.course_name}
                    </TableCell>

                    <TableCell>
                      Priority {pref.priority}
                    </TableCell>

                        <TableCell align="center">

                            <Button
                                size="small"
                                variant="contained"
                                sx={{ mr: 1 }}
                                onClick={() => editPreference(pref)}
                            >
                                Edit
                            </Button>

                            <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() => deletePreference(pref.id)}
                            >
                                Delete
                            </Button>

                        </TableCell>
                  </TableRow>
                );

              })

            )}

          </TableBody>

        </Table>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity={severity}
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
        >
          {message}
        </Alert>
      </Snackbar>

    </div>
  );
}

export default Preferences;