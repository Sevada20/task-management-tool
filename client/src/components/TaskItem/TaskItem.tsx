import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { formatDate } from "@/utils/dateUtils";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ITask } from "@/types";
import styles from "./styles";

interface ITaskItemProps {
  task: ITask;
  onStatusUpdate: (taskId: string, newStatus: string) => void;
  handleEditTask: (taskId: string) => void;
  handleDeleteTask: (taskId: string, userRole: string) => void;
}

const TaskItem = ({
  task,
  onStatusUpdate,
  handleEditTask,
  handleDeleteTask,
}: ITaskItemProps) => {
  const classes = styles();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const { user } = useContext(AuthContext);

  const handleEditTaskClick = () => {
    handleEditTask(task._id);
  };

  const handleDeleteClick = () => {
    if (!user) return;
    if (user.role === "Admin") {
      setOpenDeleteDialog(true);
    } else {
      handleDeleteTask(task._id, user.role);
    }
  };

  //handle function for button "Delete Task" in confirmation modal [S.P]
  const handleConfirmDelete = () => {
    if (!user) return;
    handleDeleteTask(task._id, user.role);
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <Card className={classes.taskCard}>
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h6" className={classes.title}>
            {task.title}
          </Typography>
          <Typography variant="body2" className={classes.description}>
            {task.description}
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", marginBottom: "0.5rem" }}
          >
            {/* formatDate is a function that formats the date to the format "DD.MM.YYYY" [S.P] */}
            Priority: {task.priority} | Due: {formatDate(task.dueDate)}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontWeight: "600", color: "#3f51b5" }}
          >
            Assigned To: {task?.assignedTo?.username}
          </Typography>
        </CardContent>
        <Box className={classes.actionButtonContainer} p={2}>
          {task.status === "To Do" && (
            <Button
              onClick={() => onStatusUpdate(task._id, "In Progress")}
              color="primary"
              variant="contained"
            >
              Set To In Progress
            </Button>
          )}
          {task.status === "In Progress" && (
            <>
              <Button
                onClick={() => onStatusUpdate(task._id, "To Do")}
                variant="contained"
                color="secondary"
              >
                Set Back To Do
              </Button>
              <Button
                onClick={() => onStatusUpdate(task._id, "Completed")}
                variant="contained"
                color="success"
              >
                Set To Complete
              </Button>
            </>
          )}
          {task.status === "Completed" && (
            <>
              <Button
                onClick={() => onStatusUpdate(task._id, "To Do")}
                variant="contained"
                color="secondary"
              >
                Set Back To Do
              </Button>
              <Button
                onClick={() => onStatusUpdate(task._id, "In Progress")}
                variant="contained"
                color="primary"
              >
                Set To In Progress
              </Button>
            </>
          )}
          <Button
            className={classes.editButton}
            variant="contained"
            color="primary"
            onClick={handleEditTaskClick}
          >
            Edit Task
          </Button>
          <Button
            className={classes.deleteButton}
            variant="outlined"
            color="error"
            onClick={handleDeleteClick}
          >
            Delete Task
          </Button>
        </Box>
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Delete Task"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  );
};

export default TaskItem;
