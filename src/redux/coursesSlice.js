import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: JSON.parse(localStorage.getItem('courses')) || [],
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    addCourse(state, action) {
      state.list.push(action.payload);
      localStorage.setItem('courses', JSON.stringify(state.list));
    },
    deleteCourse(state, action) {
      state.list = state.list.filter(course => course.id !== action.payload);
      localStorage.setItem('courses', JSON.stringify(state.list));
    },
    editCourse(state, action) {
      const updated = action.payload;
      const idx = state.list.findIndex(course => course.id === updated.id);
      if (idx !== -1) {
        state.list[idx] = updated;
        localStorage.setItem('courses', JSON.stringify(state.list));
      }
    },
    bulkDeleteCourses(state, action) {
      state.list = state.list.filter(course => !action.payload.includes(course.id));
      localStorage.setItem('courses', JSON.stringify(state.list));
    },
  },
});

export const { addCourse, deleteCourse, editCourse, bulkDeleteCourses } = coursesSlice.actions;
export default coursesSlice.reducer;