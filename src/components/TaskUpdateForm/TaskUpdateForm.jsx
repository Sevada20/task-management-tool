import { Button, TextField, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const TaskUpdateForm = ({ task, handleUpdateTask, users }) => {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    dueDate: Yup.date()
      .typeError("Please provide a valid date")
      .required("Due date is required"),
    assignedTo: Yup.string(),
  });

  const usersFiltered = users?.filter((user) => user.role === "User");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "Medium",
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      assignedTo: task?.assignedTo?._id || "",
    },
  });

  const onFormSubmit = (data) => {
    handleUpdateTask(task._id, data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <h3>Update Task</h3>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Title"
            fullWidth
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
        )}
      />
      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Priority"
            select
            fullWidth
            margin="normal"
          >
            {["Low", "Medium", "High"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="dueDate"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.dueDate}
            helperText={errors.dueDate?.message}
          />
        )}
      />
      <Controller
        name="assignedTo"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Assign To"
            select
            fullWidth
            margin="normal"
            error={!!errors.assignedTo}
            helperText={errors.assignedTo?.message}
          >
            {usersFiltered.length > 0 ? (
              usersFiltered?.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.username}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">No users found</MenuItem>
            )}
          </TextField>
        )}
      />
      <Button
        sx={{ backgroundColor: "#1c98b0" }}
        type="submit"
        variant="contained"
        color="primary"
      >
        Update Task
      </Button>
    </form>
  );
};

export default TaskUpdateForm;