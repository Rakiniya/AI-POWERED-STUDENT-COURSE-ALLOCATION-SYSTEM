import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Allocation from "./pages/Allocation";
import AI from "./pages/AI";
import Preferences from "./pages/Preferences";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/allocation" element={<Allocation />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;