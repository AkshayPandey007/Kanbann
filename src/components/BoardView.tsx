import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import TaskFormModal from './TaskFormModal'
import { FiEdit2, FiSearch, FiTrash2,FiCopy } from 'react-icons/fi'
import dayjs from 'dayjs'
import DeleteConfirmModal from './DeleteConfirmModal'
import TaskDetailModal from './TaskDetailModal'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import {
  cloneTask,
  createTask,
  deleteTaskSlice,
  fetchTasksByBoard,
  reorderTasks,
  updateTask
} from '../redux/Feature/taskSlice'

const columns = ['To Do', 'In Progress', 'Done']


const BoardView = ({ board }: { board: any }) => {
  const dispatch = useDispatch()
  const { tasks } = useSelector((state: RootState) => state.tasks)
  const [open, setOpen] = useState(false)
  const [editTask, setEditTask] = useState<any>(null)
  const [deleteTask, setDeleteTask] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  useEffect(() => {
    if (board?._id) dispatch(fetchTasksByBoard(board._id) as any)
  }, [board._id, dispatch])

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result
    if (!destination) return

    // If dropped in same position, no need to do anything
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Clone tasks of that column
    const columnTasks: any = [
      ...filteredTasks.filter((t: any) => t.status === source.droppableId)
    ]

    // Find the task being dragged
    const draggedTaskIndex = columnTasks.findIndex(
      (t: any) => t._id === draggableId
    )
    const [movedTask]: any = columnTasks.splice(draggedTaskIndex, 1)

    // Update status if it's moved across columns
    const movedTaskCopy = { ...movedTask, status: destination.droppableId }

    // Insert it into the new position
    columnTasks.splice(destination.index, 0, movedTaskCopy)

    // Update positions (index = position)
    const reorderedTasks = columnTasks.map((task: any, index: number) => ({
      _id: task._id,
      position: index,
      status: task.status
    }))

    // Dispatch updateTask if status has changed
    if (source.droppableId !== destination.droppableId) {
      dispatch(
        updateTask({
          id: movedTask._id,
          data: { ...movedTask, status: destination.droppableId }
        }) as any
      )
    }

    // Reorder in backend
    try {
      await dispatch(reorderTasks(reorderedTasks) as any)
      dispatch(fetchTasksByBoard(board._id) as any)
    } catch (err) {
      console.error('Reorder failed', err)
    }
  }

  const filteredTasks = tasks.filter((t: any) => {
    const matchesSearch = t.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter
      ? t.priority === priorityFilter
      : true
    return matchesSearch && matchesPriority
  })

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>{board.name}</h2>
      {/* Controls */}
      <div className='flex flex-wrap gap-4 mb-4'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search tasks...'
            className='border rounded pl-10 pr-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <FiSearch className='absolute left-3 top-2.5 text-gray-400' />
        </div>

        <select
          className='appearance-none border border-gray-300 rounded px-3 py-2 h-10 bg-white pr-8 shadow-sm text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400'
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
        >
          <option value=''>All Priorities</option>
          <option value='low'>🟢 Low</option>
          <option value='medium'>🟡 Medium</option>
          <option value='high'>🔴 High</option>
        </select>

        <button
          onClick={() => setOpen(true)}
          className='mb-4 px-4 py-2 bg-green-600 text-white rounded'
        >
          + Add Task
        </button>
      </div>
      <TaskFormModal
        open={open}
        onClose={() => {
          setOpen(false)
          setEditTask(null)
        }}
        initialValues={editTask}
        onSubmit={async (formData: any) => {
          if (editTask) {
            dispatch(
              updateTask({
                id: editTask._id,
                data: { ...editTask, ...formData }
              }) as any
            )
          } else {
            dispatch(createTask({ ...formData, boardId: board._id }) as any)
          }
          setEditTask(null)
          setOpen(false)
        }}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className='grid grid-cols-3 gap-4'>
          {columns.map(col => (
            <Droppable droppableId={col} key={col}>
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='bg-gray-100 p-3 rounded shadow min-h-[300px]'
                >
                       <div className="sticky top-0 z-10 p-4 text-lg font-semibold text-white rounded-t-2xl"
           style={{
             backgroundColor:
               col === 'To Do' ? '#2563eb' : col === 'In Progress' ? '#f59e0b' : '#10b981',
           }}>
        {col}
      </div>

                  {filteredTasks
                    ?.filter((t: any) => t.status === col)
                    .sort((a: any, b: any) => a.position - b.position)
                    .map((task: any, index: number) => (
                      <Draggable
                        draggableId={task._id}
                        index={index}
                        key={task._id}
                      >
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => setSelectedTask(task)}
                            className='bg-white rounded-2xl shadow-md p-4 mb-3 cursor-pointer hover:shadow-lg transition'
                          >
                            <div className='flex justify-between items-start mb-2'>
                              <h4 className='text-lg font-semibold text-gray-800'>
                                {task.title}
                              </h4>
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  task.priority === 'high'
                                    ? 'bg-red-100 text-red-700'
                                    : task.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-green-100 text-green-700'
                                }`}
                              >
                                {task.priority.toUpperCase()}
                              </span>
                            </div>

                            <p className='text-sm text-gray-600 mb-2 line-clamp-2'>
                              {task.description}
                            </p>

                            <div className='text-xs text-gray-500 mb-3'>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>

                            <div className='flex justify-end gap-3 text-gray-500'>
                              <FiCopy
  className="cursor-pointer hover:text-purple-600"
  onClick={e => {
    e.stopPropagation();
    dispatch(cloneTask(task._id) as any);
  }}
/>
                              <FiEdit2
                                className='hover:text-blue-600 transition cursor-pointer'
                                onClick={e => {
                                  e.stopPropagation()
                                  setEditTask({
                                    ...task,
                                    dueDate: task.dueDate
                                      ? dayjs(task.dueDate).format('YYYY-MM-DD')
                                      : ''
                                  })
                                  setOpen(true)
                                }}
                              />
                              <FiTrash2
                                className='hover:text-red-600 transition cursor-pointer'
                                onClick={e => {
                                  e.stopPropagation()
                                  setDeleteTask(task)
                                  setShowDeleteModal(true)
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteTask(null)
        }}
        onConfirm={() => {
          dispatch(deleteTaskSlice(deleteTask._id) as any)
          setShowDeleteModal(false)
          setDeleteTask(null)
        }}
        title={`Delete "${deleteTask?.title}"?`}
        message={`Are you sure you want to delete the task "${deleteTask?.title}"? This action cannot be undone.`}
      />

      <TaskDetailModal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </div>
  )
}

export default BoardView
