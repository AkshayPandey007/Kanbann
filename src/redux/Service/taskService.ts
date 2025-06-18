import axios from 'axios';

const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;

export const getTasksByBoard = async (boardId:any) => {
  const response = await axios.get(`${API_BASE_URL}api/tasks/board/${boardId}`);
  return response.data;
};

export const createTask = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}api/tasks`, data);
  return response.data;
};

export const updateTask = async (id: string, data: any) => {
  const response = await axios.put(`${API_BASE_URL}api/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string) => {
  await axios.delete(`${API_BASE_URL}api/tasks/${id}`);
  return id;
};

export const reorderTasks = async (tasks: any[]) => {
  const response = await axios.put(`${API_BASE_URL}api/tasks/reorder`, { tasks });
  return response.data;
};


export const cloneTaskAPI = async (id: string) => {
  const response = await axios.post(`${API_BASE_URL}api/tasks/${id}/clone`);
  return response.data;
};



//Export Task Service
const TaskService = {
    getTasksByBoard,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
    cloneTaskAPI
  };
  
  export default TaskService;