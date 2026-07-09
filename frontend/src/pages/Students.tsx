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

function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [marks, setMarks] = useState(0);
  const [category, setCategory] = useState("General");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await api.get("/students/");
      setStudents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setMarks(0);
    setCategory("General");
  };

  const saveStudent = async () => {
    try {
      const payload = {
        student_id: studentId,
        name,
        marks: Number(marks),
        category,
      };

      if (editingId === null) {
        await api.post("/students/", payload);
        setMessage("Student added successfully.");
        setSeverity("success");
        setOpenSnackbar(true);
      } else {
        await api.put(`/students/${editingId}`, payload);
        setMessage("Student updated successfully.");
setSeverity("success");
setOpenSnackbar(true);
      }

      clearForm();
      loadStudents();
    } catch (error) {
      console.error(error);
      setMessage("Operation failed.");
setSeverity("error");
setOpenSnackbar(true);
    }
  };

  const editStudent = (student: any) => {
    setEditingId(student.id);
    setStudentId(student.student_id);
    setName(student.name);
    setMarks(student.marks);
    setCategory(student.category);
  };

  const deleteStudent = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      await api.delete(`/students/${id}`);
      setMessage("Student deleted successfully.");
setSeverity("success");
setOpenSnackbar(true);
      loadStudents();
    } catch (error) {
      console.error(error);
      alert("Delete failed.");
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.student_id.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "General":
        return "primary";
      case "OBC":
        return "secondary";
      case "SC":
        return "success";
      case "ST":
        return "warning";
      default:
        return "default";
    }
  };

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
        Students
      </Typography>

      <Typography color="text.secondary" gutterBottom>
        Total Students: {students.length}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? "Update Student" : "Add Student"}
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Student Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Marks"
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              select
              fullWidth
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="OBC">OBC</MenuItem>
              <MenuItem value="SC">SC</MenuItem>
              <MenuItem value="ST">ST</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{ height: "56px" }}
              onClick={saveStudent}
            >
              {editingId ? "Update" : "Add"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <TextField
          label="Search Student"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />

        <Button variant="contained" onClick={loadStudents}>
          Refresh
        </Button>
      </Box>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Student ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Marks</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell>{student.student_id}</TableCell>

                <TableCell>{student.name}</TableCell>

                <TableCell>{student.marks}</TableCell>

                <TableCell>
                  <Chip
                    label={student.category}
                    color={getCategoryColor(student.category) as any}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => editStudent(student)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={{ ml: 1 }}
                    onClick={() => deleteStudent(student.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default Students;