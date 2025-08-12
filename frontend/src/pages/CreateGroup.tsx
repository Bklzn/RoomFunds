import { Button, Paper, TextField, Typography } from "@mui/material";
import { apiGroupsCreate } from "../api/api/api";
import { useForm } from "react-hook-form";
import { Group } from "../api/model";
import { useNavigate } from "react-router-dom";

type FormProps = Omit<Group, "owner" | "moderators" | "members">;
const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
  } = useForm<FormProps>({
    defaultValues: { name: "", description: "" },
  });
  const onSubmit = async () => {
    const { name, description } = getValues();
    console.log(name, description);
    await apiGroupsCreate({ name, description }).then(
      () => navigate("/"),
      (err) => {
        console.error(err);
        Object.keys(err.response?.data).forEach((key) => {
          setError(key as keyof FormProps, {
            message: err.response?.data[key][0],
          });
        });
      }
    );
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
        boxShadow: 2,
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h5" mb={2}>
        Create Group
      </Typography>
      <TextField
        label="Group Name"
        variant="outlined"
        fullWidth
        margin="normal"
        required
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name ? errors.name.message : ""}
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description ? errors.description.message : ""}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Create
      </Button>
    </Paper>
  );
};

export default CreateGroup;
