import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  PaperProps,
  Select,
  SelectChangeEvent,
  Skeleton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useApiGroupsList } from "../api/api/api";
import { useGroup } from "../context/GroupContext";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";

const GroupSelect: typeof Paper = (props: PaperProps) => {
  const { sx, ...rest } = props;
  const groups = useApiGroupsList();
  const { group, setGroup } = useGroup();
  const navigate = useNavigate();
  const theme = useTheme();
  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value === "+newGroup+") {
      navigate("/creategroup");
      return;
    }
    setGroup(event.target.value as string);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1,
        minWidth: 250,
        ...sx,
      }}
      {...rest}
    >
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Your Groups</InputLabel>
        {groups.isLoading ? (
          <Skeleton animation="wave" sx={{ height: 50 }} />
        ) : groups.isError ? (
          <Typography>{groups.error.message}</Typography>
        ) : (
          <Box sx={{ display: "flex" }}>
            <Select
              value={group}
              defaultValue={group}
              label="Your Groups"
              error={groups.isError}
              onChange={handleChange}
              sx={{
                width: "100%",
              }}
            >
              {groups.data!.map((g, idx) => (
                <MenuItem key={g.name + idx} value={g.name}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
            <Tooltip title="Create Group">
              <IconButton
                onClick={() => navigate("/creategroup")}
                sx={{
                  ml: 1,
                  borderRadius: 1,
                  width: 55,
                  border: "1px solid",
                  borderColor: theme.palette.grey[700],
                }}
              >
                <Add />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </FormControl>
    </Paper>
  );
};
export default GroupSelect;
