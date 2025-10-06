import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { JSX } from "react";

interface Props {
  open: boolean;
  loading?: boolean;
  setOpen: (value: boolean) => void;
  onAgree: () => void;
  onDisagree: () => void;
  title: JSX.Element | string;
  description: JSX.Element | string;
  error?: string;
}

const DeleteModal: React.FC<Props> = ({
  open,
  loading = false,
  setOpen,
  onAgree,
  onDisagree,
  title,
  description,
  error,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {typeof description === "string" ? (
          <DialogContentText>{description}</DialogContentText>
        ) : (
          description
        )}
      </DialogContent>
      {error && (
        <DialogContent>
          <DialogContentText color="error.light">{error}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onDisagree}>Cancel</Button>
        <Button onClick={onAgree} autoFocus color="error" loading={loading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
