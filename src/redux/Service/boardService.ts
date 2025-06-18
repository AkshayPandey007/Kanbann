import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllBoards = async () => {
  const response = await axios.get(`${API_BASE_URL}api/boards`);
  return response.data;
};

export const createBoard = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}api/boards`, data);
  return response.data;
};

export const updateBoard = async (id: string, data: any) => {
  const response = await axios.put(`${API_BASE_URL}api/boards/${id}`, data);
  return response.data;
};

export const deleteBoard = async (id: string) => {
  await axios.delete(`${API_BASE_URL}api/boards/${id}`);
  return id;
};


//Export Board Service
const BoardService = {
    getAllBoards,
    createBoard,
    updateBoard,
    deleteBoard
  };
  
  export default BoardService;