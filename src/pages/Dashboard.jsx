import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

// Pie chart colors
const COLORS = ["#60a5fa", "#fbbf24", "#34d399", "#f87171", "#a78bfa"];

// Memoized PieChart for performance
const CategoryPieChart = React.memo(({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {data.map((entry, idx) => (
          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
));

function Dashboard() {
  const navigate = useNavigate();
  const courses = useSelector((state) => state.courses.list);

  // Stats
  const totalCourses = courses.length;
  const byCategory = useMemo(() => {
    const map = {};
    courses.forEach((c) => {
      map[c.category] = (map[c.category] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [courses]);

  // Completion
  const progressData = useMemo(() => {
    const progress = JSON.parse(localStorage.getItem("progress") || "{}");
    let completedCourses = 0;
    courses.forEach((course) => {
      const totalLessons = course.sections.reduce((sum, sec) => sum + sec.lessons.length, 0);
      const completedCount = progress[course.id]
        ? Object.values(progress[course.id]).filter(Boolean).length
        : 0;
      if (totalLessons && completedCount === totalLessons) completedCourses++;
    });
    return {
      completed: completedCourses,
      inProgress: totalCourses - completedCourses,
    };
  }, [courses, totalCourses]);

  return (
    <div className="max-w-5xl mx-auto p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-6">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 animate-bounce-in">
          Admin Dashboard
        </h1>
        <button
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={() => navigate("/create")}
        >
          + Create New Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-orange-100 to-orange-300 rounded-xl shadow-lg p-8 text-center transform transition-transform duration-300 hover:scale-105">
          <div className="text-5xl font-extrabold text-orange-900 mb-2">{totalCourses}</div>
          <div className="text-orange-700 text-lg font-semibold">Total Courses</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-300 rounded-xl shadow-lg p-8 text-center transform transition-transform duration-300 hover:scale-105">
          <div className="text-5xl font-extrabold text-green-900 mb-2">{progressData.completed}</div>
          <div className="text-green-700 text-lg font-semibold">Completed Courses</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-xl shadow-lg p-8 text-center transform transition-transform duration-300 hover:scale-105">
          <div className="text-5xl font-extrabold text-yellow-900 mb-2">{progressData.inProgress}</div>
          <div className="text-yellow-700 text-lg font-semibold">In Progress</div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3 border-gray-200">Course Distribution by Category</h2>
        {byCategory.length === 0 ? (
          <div className="text-gray-500 text-center text-lg py-10">No data available for categories.</div>
        ) : (
          <CategoryPieChart data={byCategory} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;