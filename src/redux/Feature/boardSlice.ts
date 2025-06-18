// src/features/board/boardSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BoardService from '../Service/boardService';


export const fetchBoards = createAsyncThunk('boards/fetch', async (_, thunkAPI) => {
  try {
    return await BoardService.getAllBoards();
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const createBoard = createAsyncThunk('boards/create', async (data: any, thunkAPI) => {
  try {
    return await BoardService.createBoard(data);
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const updateBoard = createAsyncThunk('boards/update', async ({ id, data }: any, thunkAPI) => {
  try {
    return await BoardService.updateBoard(id, data);
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const deleteBoardSlice = createAsyncThunk('boards/delete', async (id: string, thunkAPI) => {
  try {
    return await BoardService.deleteBoard(id);
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

const boardSlice = createSlice({
  name: 'boards',
  initialState: {
    boards: [] as any,
    selectedBoard: null,
    loading: false,
    error: ''
  },
  reducers: {
    setSelectedBoard: (state: any, action: any) => {
      state.selectedBoard = action.payload;
    }
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchBoards.pending, (state: any) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchBoards.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.boards = action.payload;
        state.selectedBoard = action.payload[0] || null;
      })
      .addCase(fetchBoards.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBoard.fulfilled, (state: any, action: any) => {
        state.boards.push(action.payload);
        state.selectedBoard = action.payload;
      })
      .addCase(updateBoard.fulfilled, (state: any, action: any) => {
        state.boards = state.boards.map((board: any) =>
          board._id === action.payload._id ? action.payload : board
        );
        state.selectedBoard = action.payload;
      })
      .addCase(deleteBoardSlice.fulfilled, (state: any, action: any) => {
        state.boards = state.boards.filter((board: any) => board._id !== action.payload);
        if (state.selectedBoard?._id === action.payload) {
          state.selectedBoard = state.boards[0] || null;
        }
      });
  }
});

export const { setSelectedBoard } = boardSlice.actions;
export default boardSlice.reducer;
