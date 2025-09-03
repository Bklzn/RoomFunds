import {
  Box,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  PaperProps,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography,
} from "@mui/material";
import { useApiGroupsList } from "../api/api/api";
import { useGroup } from "../context/GroupContext";
import CreateGroupModal from "./CreateGroupModal";

const GroupSelect: React.FC = (props: PaperProps) => {
  const { state } = useGroup();

  if (state === "loading") return <LoadingGroupSelect {...props} />;
  if (state === "error" || state === "empty")
    return <NoGroupSelect {...props} />;

  return <SuccessGroupSelect {...props} />;
};

const LoadingGroupSelect: React.FC = (props: PaperProps) => {
  const { sx, ...rest } = props;
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
        <Box sx={{ display: "flex" }}>
          <Select
            defaultValue={1}
            label="Your Groups"
            sx={{
              width: "100%",
            }}
            disabled
          >
            <MenuItem value={1}>
              <LinearProgress
                color="inherit"
                sx={{ height: 22, opacity: 0.5, borderRadius: 22 }}
              />
            </MenuItem>
          </Select>
          <CreateGroupModal btnProps={{ loading: true }} />
        </Box>
      </FormControl>
    </Paper>
  );
};

const SuccessGroupSelect: React.FC = (props: PaperProps) => {
  const groups = useApiGroupsList({ query: { queryKey: ["groups"] } });
  const { group, setGroup } = useGroup();
  const { sx, ...rest } = props;
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
              onChange={(e: SelectChangeEvent) => setGroup(e.target.value)}
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
            <CreateGroupModal />
          </Box>
        )}
      </FormControl>
    </Paper>
  );
};

const NoGroupSelect: React.FC<PaperProps> = (props) => {
  const { sx, ...rest } = props;
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
        <Box sx={{ display: "flex" }}>
          <Select
            value={"---"}
            label="Your Groups"
            sx={{
              width: "100%",
            }}
          >
            <MenuItem value={"---"}>---</MenuItem>
          </Select>
          <CreateGroupModal btnProps={{ disabled: true }} />
        </Box>
      </FormControl>
    </Paper>
  );
};
export default GroupSelect;
