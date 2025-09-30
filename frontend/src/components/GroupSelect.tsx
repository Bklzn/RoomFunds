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
} from "@mui/material";
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
  const { selectedGroup, setGroup, groups } = useGroup();
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
            value={selectedGroup}
            defaultValue={selectedGroup}
            label="Your Groups"
            onChange={(e: SelectChangeEvent) => setGroup(e.target.value)}
            sx={{
              width: "100%",
            }}
          >
            {groups.map((g) => (
              <MenuItem key={g.slug} value={g.slug}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
          <CreateGroupModal />
        </Box>
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
