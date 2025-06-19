// src/redux/slices/taskSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction, } from '@reduxjs/toolkit';
import TaskService from '../Service/taskService';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: string;
  position: number;
  board: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export const fetchTasksByBoard = createAsyncThunk(
  'tasks/fetchByBoard',
  async (boardId: string, thunkAPI) => {
    try {
      return await TaskService.getTasksByBoard(boardId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (data: any, thunkAPI) => {
    try {
      return await TaskService.createTask(data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }: { id: string; data: any }, thunkAPI) => {
    try {
      return await TaskService.updateTask(id, data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteTaskSlice = createAsyncThunk(
  'tasks/delete',
  async (id: string, thunkAPI) => {
    try {
      return await TaskService.deleteTask(id);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const reorderTasks = createAsyncThunk(
  'tasks/reorderTasks',
  async (tasks: any[], thunkAPI) => {
    try {
      const res = await TaskService.reorderTasks(tasks);
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const cloneTask = createAsyncThunk('tasks/clone', async (id: string) => {
  return await TaskService.cloneTaskAPI(id);
});

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByBoard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasksByBoard.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByBoard.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks = state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );
      })
      .addCase(deleteTaskSlice.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      })
      .addCase(reorderTasks.pending, (state) => {
        // state.loading = true;
      })
     .addCase(reorderTasks.fulfilled, (state, action: PayloadAction<any[]>) => {
  action.payload.forEach((updated) => {
    const task = state.tasks.find((t: any) => t._id === updated._id);
    if (task) {
      task.position = updated.position;
      task.status = updated.status;
    }
  });
})
      .addCase(reorderTasks.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cloneTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      });
  }
});

export default taskSlice.reducer;
