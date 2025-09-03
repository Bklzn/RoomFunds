import { Box } from "@mui/material";
import GroupSelect from "./GroupSelect";
import UserBalance from "./UserBalance";

const GroupBasics: React.FC = () => (
  <Box sx={{ display: "flex", pb: 2, gap: 1 }}>
    <GroupSelect />
    <UserBalance />
  </Box>
);
export default GroupBasics;
