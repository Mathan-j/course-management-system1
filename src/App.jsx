import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import CreateCourse from "./pages/CreateCourse";
import CourseDetail from "./pages/CourseDetail";
import EditCourse from "./pages/EditCourse";
import Dashboard from "./pages/Dashboard";
import './index.css';
import ErrorBoundary from "./components/ErrorBoundary";

function Navbar() {
  const location = useLocation();
  return (
    <nav className="bg-blue-700 shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-white text-2xl font-bold tracking-tight">
          🎓 CourseManager
        </Link>
        <div className="flex gap-6">
          <Link
            to="/"
            className={`text-white hover:text-blue-200 transition ${location.pathname === "/" ? "underline" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`text-white hover:text-blue-200 transition ${location.pathname === "/dashboard" ? "underline" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            to="/create"
            className="bg-white text-blue-700 px-4 py-1 rounded font-semibold shadow hover:bg-blue-100 transition"
          >
            + New Course
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen pb-10">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateCourse />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/edit/:id" element={<EditCourse />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </>
  );
}

export default App;
