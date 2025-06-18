import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBoard, deleteBoardSlice, fetchBoards, setSelectedBoard, updateBoard } from './redux/Feature/boardSlice';
import type { AppDispatch ,RootState} from './store';
import BoardView from './components/BoardView';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import BoardFormModal from './components/BoardFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { boards, selectedBoard }:any = useSelector((state: RootState) => state.boards);

  const [editBoard, setEditBoard] = useState<any>(null);
  const [deleteBoard, setDeleteBoard] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const handleBoardSave = async (boardData: any) => {
    if (editBoard?._id) {
      await dispatch(updateBoard({ id: editBoard._id, data: boardData }));
    } else {
      await dispatch(createBoard(boardData));
    }
    setEditBoard(null);
  };

  const handleBoardDelete = async () => {
    if (!deleteBoard) return;
    await dispatch(deleteBoardSlice(deleteBoard._id));
    setDeleteBoard(null);
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4 border-r flex flex-col">
        <h2 className="text-xl font-bold mb-4">Boards</h2>
        <div className="flex-1 overflow-y-auto">
          {boards?.map((board: any) => (
            <div
              key={board._id}
              className={`p-2 rounded mb-2 cursor-pointer flex justify-between items-center ${
                selectedBoard?._id === board._id ? 'bg-blue-200' : 'hover:bg-blue-100'
              }`}
              onClick={() => dispatch(setSelectedBoard(board))}
            >
              <span className="truncate">{board.name}</span>
              <div
                className="flex gap-2 text-gray-600"
                onClick={(e) => e.stopPropagation()}
              >
                <FiEdit2
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => setEditBoard(board)}
                />
                <FiTrash2
                  className="cursor-pointer hover:text-red-600"
                  onClick={() => setDeleteBoard(board)}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setEditBoard({ name: '' })}
        >
          + New Board
        </button>
      </aside>

      <main className="flex-1 p-4 overflow-auto">
        {selectedBoard && <BoardView board={selectedBoard} />}
      </main>

      {/* Create/Edit Modal */}
      <BoardFormModal
        open={!!editBoard}
        onClose={() => setEditBoard(undefined)}
        onSubmit={handleBoardSave}
        initialValues={editBoard}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={!!deleteBoard}
        onClose={() => setDeleteBoard(null)}
        onConfirm={handleBoardDelete}
        title={deleteBoard?.name}
      />
    </div>
  );
};

export default App;
