import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  alpha,
  CSSObject,
  styled,
  Theme,
  useTheme,
} from "@mui/material/styles";
import {
  BarChart,
  ChevronLeft,
  ChevronRight,
  Group,
  Logout,
  Settings,
  TableView,
} from "@mui/icons-material";
import MuiDrawer from "@mui/material/Drawer";
import { useState } from "react";
import reactLogo from "../../assets/react.svg";
import WhoamiContainer from "../WhoamiContainer";
import SidebarListItemBtn from "./SidebarListItemBtn";
import { useLocation, useNavigate } from "react-router-dom";

const draverBasicCSS = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  display: "flex",
  justifyContent: "space-between",
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...draverBasicCSS(theme),
        "& .MuiDrawer-paper": {
          ...draverBasicCSS(theme),
          width: "280px !important",
        },
        width: "280px !important",
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...draverBasicCSS(theme),
        "& .MuiDrawer-paper": {
          ...draverBasicCSS(theme),
        },
      },
    },
  ],
}));

const SidebarBtn = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 10,
  right: -15,
  zIndex: 9999,
  width: 30,
  height: 30,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  backgroundImage:
    theme.palette.mode === "dark"
      ? `linear-gradient(${alpha(theme.palette.common.white, 0.15)}, ${alpha(
          theme.palette.common.white,
          0.15
        )})`
      : `none`,
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    backgroundImage:
      theme.palette.mode === "dark"
        ? `linear-gradient(${alpha(theme.palette.common.white, 0.2)}, ${alpha(
            theme.palette.common.white,
            0.2
          )})`
        : `none`,
  },
}));

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box sx={{ position: "relative" }}>
      <SidebarBtn onClick={() => setOpen(!open)}>
        {(theme.direction === "rtl" && !open) ||
        (theme.direction !== "rtl" && open) ? (
          <ChevronLeft />
        ) : (
          <ChevronRight />
        )}
      </SidebarBtn>
      <Drawer variant="permanent" open={open}>
        <Box>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
          >
            <Box component="img" src={reactLogo} width={40} height={40} />
            RoomFunds
          </Typography>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <SidebarListItemBtn
                open={open}
                text="Dashboard"
                active={location.pathname === "/"}
                onClick={() => navigate("/")}
              >
                <TableView />
              </SidebarListItemBtn>
            </ListItem>
            <Tooltip title="In development" arrow enterDelay={500}>
              <ListItem disablePadding sx={{ display: "block" }}>
                <SidebarListItemBtn
                  open={open}
                  text="Stats"
                  disabled
                  active={location.pathname === "/stats"}
                >
                  <BarChart />
                </SidebarListItemBtn>
              </ListItem>
            </Tooltip>
            <Tooltip title="In development" arrow enterDelay={500}>
              <ListItem disablePadding sx={{ display: "block" }}>
                <SidebarListItemBtn
                  open={open}
                  text="Group"
                  disabled
                  active={location.pathname === "/group"}
                  onClick={() => navigate("/group")}
                >
                  <Group />
                </SidebarListItemBtn>
              </ListItem>
            </Tooltip>
          </List>
        </Box>
        <Box>
          <Tooltip title="In development" arrow enterDelay={500}>
            <ListItem disablePadding>
              <SidebarListItemBtn
                open={open}
                text="Settings"
                disabled
                active={location.pathname === "/settings"}
              >
                <Settings />
              </SidebarListItemBtn>
            </ListItem>
          </Tooltip>
          <WhoamiContainer
            variant={open ? "all" : "hover"}
            sx={{
              maxWidth: open ? 100 : 0,
              m: open ? "auto" : 2,
            }}
          />
          <ListItem
            disablePadding
            sx={{ display: "block", color: theme.palette.error.main }}
          >
            <SidebarListItemBtn
              open={open}
              text="Logout"
              active={false}
              onClick={() => navigate("/logout")}
            >
              <Logout />
            </SidebarListItemBtn>
          </ListItem>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
