import {
  Box,
  Button,
  Modal,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useApiExpensesCreate } from "../api/api/api";
import { useGroup } from "../context/GroupContext";
import { Expense } from "../api/model";
import { useQueryClient } from "@tanstack/react-query";

const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

type FormProps = Omit<Expense, "user" | "category_display">;

const ExpenseAddForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isDescShowed, setIsDescShowed] = useState(false);
  const { group } = useGroup();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormProps>({
    date: "",
    amount: "0",
    category: "",
    description: "",
    group: "",
  });
  const saveExpenses = useApiExpensesCreate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    saveExpenses.mutateAsync({ data: { ...formData, group } }).then(
      () => {
        console.log("expense created");
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        setOpen(false);
      },
      (err) => {
        console.error(err);
      }
    );
  };
  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add new expenses
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyles}>
          <Typography variant="h6" component="h2" mb={2}>
            Formularz
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-row gap-4 flex-wrap">
              <TextField
                name="date"
                value={formData.date}
                onChange={handleChange}
                type="date"
                className="flex-3"
              />
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                className="flex-3"
              />
              <TextField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="flex-3"
              />
              <Button
                type="button"
                variant="outlined"
                className="flex-2"
                size="small"
                onClick={() => setIsDescShowed(true)}
              >
                Add Description
              </Button>
            </div>
            <TextareaAutosize
              style={{
                display: isDescShowed ? "block" : "none",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: 4,
                marginTop: 20,
              }}
              minRows={3}
              onChange={handleChange}
              name="description"
              value={formData.description}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Save
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ExpenseAddForm;
