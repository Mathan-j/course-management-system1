import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { editCourse } from "../redux/coursesSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.list);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const found = courses.find((c) => String(c.id) === String(id));
    if (found) setCourse({ ...found });
  }, [id, courses]);

  if (!course) return <div className="p-4">Loading...</div>;

  const handleChange = (field, value) => {
    setCourse((prev) => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (secIdx, field, value) => {
    const updatedSections = [...course.sections];
    updatedSections[secIdx][field] = value;
    setCourse((prev) => ({ ...prev, sections: updatedSections }));
  };

  const handleLessonChange = (secIdx, lesIdx, field, value) => {
    const updatedSections = [...course.sections];
    updatedSections[secIdx].lessons[lesIdx][field] = value;
    setCourse((prev) => ({ ...prev, sections: updatedSections }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!course.thumbnail.trim()) {
      alert("Thumbnail image URL is mandatory");
      return;
    }
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(course.thumbnail.trim()) &&
        !/^https?:\/\/.+(bing\.com|unsplash\.com|placeimg\.com|placeholder\.com|google\.com|googleusercontent\.com)/i.test(course.thumbnail.trim())) {
      alert("Thumbnail must be a valid image URL (jpg, jpeg, png, gif, webp, svg, or trusted image host, including Google)");
      return;
    }
    dispatch(editCourse(course));
    alert("Course updated!");
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-2xl my-10 animate-fade-in-up">
      <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 animate-bounce-in">
        Edit Course
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-700">Title</label>
          <input
            type="text"
            value={course.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-300 ease-in-out text-gray-800"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-700">Description</label>
          <ReactQuill
            theme="snow"
            value={course.description}
            onChange={(val) => handleChange("description", val)}
            className="bg-gray-50 rounded-lg shadow-inner"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-700">Thumbnail URL</label>
          <input
            type="text"
            value={course.thumbnail}
            onChange={(e) => handleChange("thumbnail", e.target.value)}
            className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-300 ease-in-out text-gray-800"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-700">Category</label>
          <select
            value={course.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-300 ease-in-out bg-white text-gray-800"
          >
            <option>Programming</option>
            <option>Design</option>
            <option>Business</option>
            <option>Marketing</option>
          </select>
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-700">Difficulty</label>
          <select
            value={course.difficulty}
            onChange={(e) => handleChange("difficulty", e.target.value)}
            className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-300 ease-in-out bg-white text-gray-800"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        {/* Sections and lessons editing */}
        <div className="space-y-8 mt-8 p-6 bg-orange-50 rounded-xl shadow-inner">
          <h2 className="text-2xl font-bold text-orange-800 pb-4 border-b border-orange-200">Course Sections</h2>
          {course.sections.map((section, secIdx) => (
            <div key={secIdx} className="border border-orange-300 p-6 rounded-lg bg-white shadow-md animate-fade-in-down">
              <div className="mb-4">
                <label className="block text-xl font-semibold mb-2 text-gray-700">Section Title</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out"
                  value={section.title}
                  onChange={(e) => handleSectionChange(secIdx, "title", e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-xl font-semibold mb-2 text-gray-700">Section Description</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out"
                  value={section.description}
                  onChange={(e) => handleSectionChange(secIdx, "description", e.target.value)}
                />
              </div>
              <div className="space-y-4 mt-6 p-4 bg-blue-50 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold text-blue-800 pb-3 border-b border-blue-200">Lessons</h3>
                {section.lessons.map((lesson, lesIdx) => (
                  <div key={lesIdx} className="bg-white p-5 mt-4 rounded-lg shadow-sm border border-blue-100 animate-fade-in-right">
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Lesson Title"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 ease-in-out"
                        value={lesson.title}
                        onChange={(e) => handleLessonChange(secIdx, lesIdx, "title", e.target.value)}
                      />
                    </div>
                    <ReactQuill
                      theme="snow"
                      value={lesson.content}
                      onChange={(val) => handleLessonChange(secIdx, lesIdx, "content", val)}
                      className="bg-gray-50 rounded-lg shadow-inner"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out mt-8">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditCourse;
