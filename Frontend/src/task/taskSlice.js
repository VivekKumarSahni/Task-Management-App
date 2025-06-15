import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createTask, fetchTaskById, fetchTasksByFilters, updateTask, deleteTask } from './taskAPI';

const initialState = {
  tasks: [],
  status: 'idle',
  totalItems: 0,
  selectedTask: null
};

export const fetchTaskByIdAsync = createAsyncThunk(
  'task/fetchTaskById',
  async (id) => {
    const response = await fetchTaskById(id);
    return response.data;
  }
);

export const fetchTasksByFiltersAsync = createAsyncThunk(
  'task/fetchAllTasksByFilters',
  async ({ filter, sortBy, order, page, limit }) => {
    const response = await fetchTasksByFilters(filter, sortBy, order, page, limit);
    return response.data;
  }
);

export const createTaskAsync = createAsyncThunk(
  'task/createTask',
  async (task) => {
    const response = await createTask(task);
    return response.data;
  }
);

export const updateTaskAsync = createAsyncThunk(
  'task/updateTask',
  async (update) => {
    const response = await updateTask(update);
    return response.data;
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'task/deleteTask',
  async (id) => {
    const response = await deleteTask(id);
    return response;
  }
);

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByFiltersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasksByFiltersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.tasks = action.payload.tasks;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchTaskByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTaskByIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selectedTask = action.payload;
      })
      .addCase(createTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.tasks.push(action.payload);
      })
      .addCase(updateTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const it = state.tasks.find(it => it.id === action.payload.id);
        state.tasks[state.tasks.indexOf(it)] = action.payload;
      })
      .addCase(deleteTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.tasks = state.tasks.filter(t => t.id !== action.payload.id);
        state.totalItems -= 1;
      });
  },
});

export const { clearSelectedTask } = taskSlice.actions;

export const selectAllTasks = (state) => state.task.tasks;
export const selectTotalItems = (state) => state.task.totalItems;
export const selectTaskById = (state) => state.task.selectedTask;
export const selectTaskStatus = (state) => state.task.status;

export default taskSlice.reducer;

