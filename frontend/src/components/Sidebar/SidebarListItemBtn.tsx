import {
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
} from "@mui/material";

interface Props extends ListItemButtonProps {
  open: boolean;
  text: string;
  children?: React.ReactNode;
  color?: ListItemButtonProps["color"];
  active: boolean;
}

const SidebarListItemBtn: React.FC<Props> = ({
  open,
  text,
  children,
  color = "inherit",
  active,
  ...props
}) => {
  const theme = useTheme();
  const { sx, ...other } = props;
  return (
    <Tooltip
      title={text}
      disableHoverListener={open}
      disableFocusListener={open}
      disableTouchListener={open}
      arrow
      placement={theme.direction === "rtl" ? "right" : "left"}
    >
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
          color,
          backgroundColor: active ? theme.palette.action.selected : "inherit",
          ...sx,
        }}
        {...other}
      >
        <ListItemIcon
          sx={{
            mr: open ? 3 : "auto",
            justifyContent: "center",
            color,
          }}
        >
          {children}
        </ListItemIcon>
        <ListItemText sx={{ opacity: open ? 1 : 0 }}>{text}</ListItemText>
      </ListItemButton>
    </Tooltip>
  );
};

export default SidebarListItemBtn;
