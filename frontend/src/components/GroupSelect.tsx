import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography,
} from "@mui/material";
import { useApiGroupsList } from "../api/api/api";
import { useGroup } from "../context/GroupContext";

const GroupSelect: React.FC = () => {
  const groups = useApiGroupsList();
  const { group, setGroup } = useGroup();
  const handleChange = (event: SelectChangeEvent) => {
    setGroup(event.target.value as string);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        minWidth: 250,
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Your Groups</InputLabel>
        {groups.isLoading ? (
          <Skeleton animation="wave" sx={{ height: 50 }} />
        ) : groups.isError ? (
          <Typography>{groups.error.message}</Typography>
        ) : (
          <>
            <Select
              value={group}
              defaultValue={group}
              label="Your Groups"
              error={groups.isError}
              onChange={handleChange}
            >
              {groups.data!.map((g, idx) => (
                <MenuItem key={g.name + idx} value={g.name}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
      </FormControl>
    </Paper>
  );
};
export default GroupSelect;
