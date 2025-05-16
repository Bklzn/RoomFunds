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
import { Group } from "../api/model";
import { useEffect, useState } from "react";

const GroupSelect: React.FC = () => {
  const groups = useApiGroupsList();
  const groupStorage = localStorage.getItem("selectedGroup") || "";
  const [selecetedGroup, setSelectedGroup] =
    useState<Group["name"]>(groupStorage);
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedGroup(event.target.value);
    localStorage.setItem("selectedGroup", event.target.value);
  };

  useEffect(() => {
    if (groups.data) {
      if (selecetedGroup === "") {
        setSelectedGroup(groups.data[0].name);
        localStorage.setItem("selectedGroup", groups.data[0].name);
      }
    }
  }, [groups.data, selecetedGroup]);

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
              value={selecetedGroup}
              defaultValue={selecetedGroup}
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
