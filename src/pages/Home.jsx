import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteCourse, bulkDeleteCourses } from "../redux/coursesSlice";
import { useState } from "react";

const PAGE_SIZE = 10;

function Home() {
  const courses = useSelector((state) => state.courses.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // UI State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("az");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);

  // Filtering, searching, sorting
  let filtered = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );
  if (category) filtered = filtered.filter(c => c.category === category);
  if (difficulty) filtered = filtered.filter(c => c.difficulty === difficulty);
  if (sort === "az") filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "za") filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Bulk select
  const toggleSelect = (id) => {
    setSelected(sel =>
      sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]
    );
  };
  const selectAll = () => {
    setSelected(paged.map(c => c.id));
  };
  const clearAll = () => setSelected([]);

  // Bulk delete
  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (window.confirm("Delete selected courses?")) {
      dispatch(bulkDeleteCourses(selected));
      setSelected([]);
    }
  };

  // Single delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      dispatch(deleteCourse(id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 animate-fade-in">
      <h1 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 animate-bounce-in">
        Explore Our Courses
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6 items-center justify-center p-4 bg-white rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-orange-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-300 ease-in-out"
        />
        <select value={category} onChange={e => setCategory(e.target.value)} className="border border-orange-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-300 ease-in-out">
          <option value="">All Categories</option>
          <option>Programming</option>
          <option>Design</option>
          <option>Business</option>
          <option>Marketing</option>
        </select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="border border-orange-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-300 ease-in-out">
          <option value="">All Levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="border border-orange-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-300 ease-in-out">
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
        <button
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={() => navigate("/create")}
        >
          + Create Course
        </button>
      </div>

      {/* Bulk actions */}
      <div className="flex items-center gap-3 mb-4 justify-center">
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out"
          onClick={selectAll}
        >Select All</button>
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out"
          onClick={clearAll}
        >Clear All</button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={handleBulkDelete}
          disabled={selected.length === 0}
        >Delete Selected</button>
        <span className="ml-2 text-md text-gray-600 font-medium">{selected.length} selected</span>
      </div>

      {/* Course grid */}
      {paged.length === 0 ? (
        <p className="text-center text-gray-500 text-xl mt-10">No courses found. Start by creating one!</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {paged.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between border-2 ${selected.includes(course.id) ? "border-orange-500 ring-2 ring-orange-300" : "border-gray-200"}`}
            >
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(course.id)}
                    onChange={() => toggleSelect(course.id)}
                    className="mr-3 h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <img
                    src={course.thumbnail || "https://via.placeholder.com/300x200?text=No+Image"}
                    onError={e => { e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found"; }}
                    alt={course.title}
                    className="w-24 h-16 object-cover rounded-lg shadow-md"
                  />
                </div>
                <Link to={`/course/${course.id}`}>
                  <h2 className="text-xl font-bold text-gray-800 hover:text-orange-600 transition duration-300 mb-2">
                    {course.title}
                  </h2>
                </Link>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">{course.category}</span>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">{course.difficulty}</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm p-4 border-t border-gray-100">
                <Link to={`/edit/${course.id}`} className="text-yellow-600 hover:text-yellow-700 font-medium transition duration-300 flex items-center">
                  <span className="mr-1">✏️</span> Edit
                </Link>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="text-red-600 hover:text-red-700 font-medium transition duration-300 flex items-center"
                >
                  <span className="mr-1">🗑️</span> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ease-in-out ${page === i + 1 ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;