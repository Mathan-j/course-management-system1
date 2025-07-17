import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DOMPurify from "dompurify";
import { deleteCourse } from "../redux/coursesSlice";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.list);
  const course = courses.find((c) => String(c.id) === String(id));

  // Progress state (per lesson)
  const [completed, setCompleted] = useState({});
  // Section expand/collapse
  const [openSections, setOpenSections] = useState([]);

  // Load progress from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("progress") || "{}");
    if (course?.id) setCompleted(saved[course.id] || {});
  }, [course?.id]);

  // Save progress to localStorage
  useEffect(() => {
    if (!course?.id) return;
    const saved = JSON.parse(localStorage.getItem("progress") || "{}");
    saved[course.id] = completed;
    localStorage.setItem("progress", JSON.stringify(saved));
  }, [completed, course?.id]);

  if (!course) return <div className="p-4">Course not found.</div>;

  // Toggle lesson completion
  const toggleLesson = (secIdx, lesIdx) => {
    const key = `${secIdx}-${lesIdx}`;
    setCompleted((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Progress calculation
  const totalLessons = course.sections.reduce((sum, sec) => sum + sec.lessons.length, 0);
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Section expand/collapse
  const toggleSection = (idx) => {
    setOpenSections((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Delete course
  const handleDelete = () => {
    if (window.confirm("Delete this course?")) {
      dispatch(deleteCourse(course.id));
      navigate("/");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-2xl my-10 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
        <img
          src={course.thumbnail || "https://via.placeholder.com/300x200?text=No+Image"}
          alt={course.title}
          className="w-full md:w-80 h-52 object-cover rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105"
        />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 animate-bounce-in">
            {course.title}
          </h1>
          <div className="mb-4 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(course.description)
          }} />
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
            <span className="bg-orange-100 text-orange-800 text-sm font-semibold px-4 py-1 rounded-full shadow-md">{course.category}</span>
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full shadow-md">{course.difficulty}</span>
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full shadow-md">
              {course.sections.length} sections
            </span>
          </div>
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <Link
              to={`/edit/${course.id}`}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out flex items-center"
            >
              <span className="mr-2">✏️</span> Edit Course
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out flex items-center"
            >
              <span className="mr-2">🗑️</span> Delete Course
            </button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8 p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-inner animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-lg text-orange-800">Course Progress:</span>
          <span className="text-xl font-bold text-orange-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-2 text-right">
          {completedCount} of {totalLessons} lessons completed
        </div>
      </div>

      {/* Sections & Lessons */}
      <div>
        {course.sections.map((section, secIdx) => (
          <div key={secIdx} className="mb-4 border border-orange-200 rounded-lg shadow-md overflow-hidden animate-fade-in-down">
            <button
              className="w-full text-left px-6 py-4 bg-gradient-to-r from-orange-100 to-red-100 font-bold text-xl text-orange-900 flex justify-between items-center transition-all duration-300 hover:bg-orange-200"
              onClick={() => toggleSection(secIdx)}
            >
              <span>{section.title || `Section ${secIdx + 1}`}</span>
              <span>{openSections.includes(secIdx) ? "▲" : "▼"}</span>
            </button>
            {openSections.includes(secIdx) && (
              <div className="p-6 bg-white border-t border-orange-200">
                <div className="mb-4 text-gray-700 leading-relaxed">{section.description}</div>
                <div className="space-y-4">
                  {section.lessons.map((lesson, lesIdx) => {
                    const key = `${secIdx}-${lesIdx}`;
                    return (
                      <div key={lesIdx} className="p-4 border border-blue-100 rounded-lg bg-blue-50 shadow-sm flex items-start space-x-3 animate-fade-in-right">
                        <input
                          type="checkbox"
                          checked={!!completed[key]}
                          onChange={() => toggleLesson(secIdx, lesIdx)}
                          className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div>
                          <span className="font-semibold text-lg text-blue-800">{lesson.title || `Lesson ${lesIdx + 1}`}</span>
                          <div
                            className="prose prose-sm max-w-none mt-1 text-gray-700"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(lesson.content || "")
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseDetail;
