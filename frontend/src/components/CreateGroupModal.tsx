import {
  Box,
  BoxProps,
  Button,
  IconButton,
  IconButtonProps,
  Modal,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { apiGroupsCreate } from "../api/api/api";
import { useForm } from "react-hook-form";
import { Group } from "../api/model";
import { Add, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useGroup } from "../context/GroupContext";
import { useQueryClient } from "@tanstack/react-query";

type FormProps = Omit<Group, "owner" | "moderators" | "members">;
const CreateGroupModal: React.FC<{
  boxProps?: BoxProps;
  btnProps?: IconButtonProps;
}> = ({ boxProps, btnProps }) => {
  const theme = useTheme();
  const { groups, setGroup } = useGroup();
  const [open, setOpen] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
  } = useForm<FormProps>({
    defaultValues: { name: "", description: "" },
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!groups.length) {
      setTimeout(() => setOpen(true), 500);
    }
  }, [groups.length]);

  const onSubmit = async () => {
    setIsLoad(true);
    const { name, description } = getValues();
    await apiGroupsCreate({ name, description }).then(
      (r) => {
        queryClient
          .invalidateQueries({ queryKey: ["groups"] })
          .then(() => {
            setGroup(r.slug);
            setOpen(false);
            setIsLoad(false);
          })
          .catch((err) => {
            console.error(err);
          });
      },
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
    <Box {...boxProps}>
      <Tooltip title="Create Group">
        <Box sx={{ ml: 1, height: "100%" }}>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: 1,
              width: 55,
              border: "1px solid",
              borderColor: theme.palette.grey[700],
              height: "100%",
            }}
            {...btnProps}
            disabled={!groups.length ? false : btnProps?.disabled}
          >
            <Add sx={{ m: "auto" }} />
          </IconButton>
        </Box>
      </Tooltip>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            maxWidth: 400,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            mt: 4,
            p: 3,
            boxShadow: 2,
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5" sx={{ my: "auto" }}>
              Create Group
            </Typography>
            <Box>
              <IconButton onClick={() => setOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </Stack>
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
            loading={isLoad}
          >
            Create
          </Button>
        </Paper>
      </Modal>
    </Box>
  );
};

export default CreateGroupModal;
