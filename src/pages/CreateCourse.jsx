import React, { useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import { addCourse } from "../redux/coursesSlice";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("Programming");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [sections, setSections] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddSection = () => {
    setSections([...sections, { title: "", description: "", lessons: [] }]);
  };

  const handleSectionChange = (idx, field, value) => {
    const updated = [...sections];
    updated[idx][field] = value;
    setSections(updated);
  };

  const handleRemoveSection = (idx) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleAddLesson = (secIdx) => {
    const updated = [...sections];
    updated[secIdx].lessons.push({ title: "", content: "" });
    setSections(updated);
  };

  const handleLessonChange = (secIdx, lesIdx, field, value) => {
    const updated = [...sections];
    updated[secIdx].lessons[lesIdx][field] = value;
    setSections(updated);
  };

  const handleRemoveLesson = (secIdx, lesIdx) => {
    const updated = [...sections];
    updated[secIdx].lessons = updated[secIdx].lessons.filter((_, i) => i !== lesIdx);
    setSections(updated);
  };

  const isValidImageUrl = (url) => {
    // Accepts image file extensions OR known trusted sources
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) ||
           /^https?:\/\/.*(bing\.com|unsplash\.com|picsum\.photos|placeimg\.com|placeholder\.com|google\.com|googleusercontent\.com)/i.test(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.length < 10 || title.length > 60) {
      alert("Title must be between 10 and 60 characters");
      return;
    }

    if (!thumbnail.trim()) {
      alert("Thumbnail image URL is mandatory");
      return;
    }

    if (!isValidImageUrl(thumbnail.trim())) {
      alert("Please enter a valid image URL (jpg, png, or trusted sites like Unsplash, Bing, Picsum)");
      return;
    }

    if (sections.length === 0) {
      alert("Add at least one section");
      return;
    }

    for (const section of sections) {
      if (!section.title.trim()) {
        alert("Section titles cannot be empty");
        return;
      }
      for (const lesson of section.lessons) {
        if (!lesson.title.trim()) {
          alert("Lesson titles cannot be empty");
          return;
        }
      }
    }

    const course = {
      id: Date.now(),
      title,
      description,
      thumbnail,
      category,
      difficulty,
      sections,
    };

    dispatch(addCourse(course));
    alert("Course Created ✅");
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-2xl my-10">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-orange-600">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="Enter course title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Description</label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Thumbnail URL</label>
          <input
            type="text"
            value={thumbnail}
            onChange={e => setThumbnail(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="e.g., https://picsum.photos/300/200"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full p-3 border rounded"
          >
            <option>Programming</option>
            <option>Design</option>
            <option>Business</option>
            <option>Marketing</option>
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Difficulty</label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="w-full p-3 border rounded"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-orange-800">Sections</h2>
            <button
              type="button"
              className="bg-orange-600 text-white px-4 py-2 rounded"
              onClick={handleAddSection}
            >
              + Add Section
            </button>
          </div>

          {sections.map((section, secIdx) => (
            <div key={secIdx} className="border p-4 rounded bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold">Section {secIdx + 1}</label>
                <button
                  type="button"
                  className="text-red-600"
                  onClick={() => handleRemoveSection(secIdx)}
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                className="w-full p-2 border rounded mb-2"
                value={section.title}
                onChange={e => handleSectionChange(secIdx, "title", e.target.value)}
                placeholder="Section title"
              />
              <textarea
                className="w-full p-2 border rounded mb-2"
                value={section.description}
                onChange={e => handleSectionChange(secIdx, "description", e.target.value)}
                placeholder="Section description"
              />

              {/* Lessons */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-blue-700">Lessons</h3>
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => handleAddLesson(secIdx)}
                  >
                    + Add Lesson
                  </button>
                </div>
                {section.lessons.map((lesson, lesIdx) => (
                  <div key={lesIdx} className="bg-white p-3 mt-2 rounded shadow-sm">
                    <input
                      type="text"
                      className="w-full p-2 border mb-2 rounded"
                      placeholder="Lesson Title"
                      value={lesson.title}
                      onChange={e => handleLessonChange(secIdx, lesIdx, "title", e.target.value)}
                    />
                    <ReactQuill
                      theme="snow"
                      value={lesson.content}
                      onChange={val => handleLessonChange(secIdx, lesIdx, "content", val)}
                    />
                    <button
                      type="button"
                      className="text-red-600 mt-2"
                      onClick={() => handleRemoveLesson(secIdx, lesIdx)}
                    >
                      Remove Lesson
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded text-lg font-bold hover:bg-green-700 mt-6"
        >
          Create Course
        </button>
      </form>
    </div>
  );
}

export default CreateCourse;
