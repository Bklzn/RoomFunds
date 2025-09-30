import { Box, Tooltip } from "@mui/material";
import React from "react";
import TimeAgo from "timeago-react";

const DateFormat: React.FC<{ dateStr: string }> = ({ dateStr }) => {
  const date = new Date(dateStr);

  return (
    <Tooltip
      title={date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })}
      arrow
    >
      <Box sx={{ cursor: "default", color: "text.secondary" }}>
        <TimeAgo datetime={date} locale="en-US" />
      </Box>
    </Tooltip>
  );
};

export default DateFormat;
