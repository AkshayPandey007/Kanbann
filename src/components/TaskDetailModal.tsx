import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const TaskDetailModal = ({ open, onClose, task }: any) => {
  if (!task) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Task Details</DialogTitle>
      <DialogContent dividers>
        <div className="space-y-3 text-gray-800">
          <div>
            
            <strong>Title:</strong> {task.title}
          </div>
          <div>
            <strong>Description:</strong> {task.description || '—'}
          </div>
          <div>
            <strong>Priority:</strong> {task.priority}
          </div>
          <div>
            <strong>Assigned To:</strong> {task.assignedTo}
          </div>
          <div>
            <strong>Due Date:</strong>{' '}
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
          </div>
          <div>
            <strong>Status:</strong> {task.status}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailModal;
