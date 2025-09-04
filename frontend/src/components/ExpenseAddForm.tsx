import {
  Autocomplete,
  Box,
  BoxProps,
  Button,
  IconButton,
  Modal,
  Paper,
  Stack,
  SxProps,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";
import {
  useApiExpensesCreate,
  useApiGroupCategoriesCreate,
} from "../api/api/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGroup } from "../context/GroupContext";
import { Expense } from "../api/model";
import { useQueryClient } from "@tanstack/react-query";
import { AddCircle, Close } from "@mui/icons-material";

const modalStyles: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
};

type FormProps = Omit<
  Expense,
  "user" | "category_display" | "category" | "group"
> & { category_input: string };

const ExpenseAddForm: React.FC<BoxProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [isDescShowed, setIsDescShowed] = useState(false);
  const [categoryValue, setCategoryValue] = useState<string | null>(null);
  const { group, categories } = useGroup();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormProps>({
    defaultValues: {
      amount: "",
      description: "",
      category_input: "",
      date: "",
    },
  });
  const queryClient = useQueryClient();
  const saveExpenses = useApiExpensesCreate();
  const modalResolveRef = useRef<(value: "submit" | "cancel") => void>(
    () => {}
  );

  const showCategoryModal = (): Promise<"submit" | "cancel" | null> => {
    return new Promise((resolve) => {
      modalResolveRef.current = resolve;
      setChildOpen(true);
    });
  };
  const onSubmit: SubmitHandler<FormProps> = async (data) => {
    if (categoryValue === null) {
      if (data.category_input === "") {
        console.error("Category is not selected");
        setError("category_input", {
          type: "manual",
          message: "Category is not selected",
        });
        return;
      }
      const isNewCategory = !categories.some(
        (c) => c.name === data.category_input
      );

      if (isNewCategory) {
        const result = await showCategoryModal();
        if (result === "cancel") return;
      }
    }
    saveExpenses
      .mutateAsync({
        data: {
          ...data,
          description: isDescShowed ? data.description : "",
          group,
        },
      })
      .then(
        () => {
          console.log("expense created");
          queryClient.invalidateQueries({ queryKey: ["expenses"] });
          setOpen(false);
        },
        (err) => {
          console.error(err);
          Object.keys(err.response?.data).forEach((key) => {
            setError(key as keyof FormProps, {
              message: err.response?.data[key][0],
            });
          });
        }
      );
  };
  return (
    <Box {...props}>
      <Button
        variant="contained"
        sx={{ m: "auto" }}
        onClick={() => {
          setOpen(true);
          clearErrors();
        }}
        endIcon={<AddCircle />}
      >
        Add expenses
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper sx={modalStyles} elevation={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6" component="h2" mb={2}>
              Add new expense
            </Typography>
            <Box>
              <IconButton onClick={() => setOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </Stack>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row gap-4 flex-wrap">
              <TextField
                {...register("date")}
                type="date"
                className="flex-3"
                error={!!errors.date}
                helperText={errors.date ? errors.date?.message : ""}
              />
              <TextField
                {...register("amount")}
                label="Amount"
                type="number"
                slotProps={{ htmlInput: { step: 0.01 } }}
                className="flex-3"
                error={!!errors.amount}
                helperText={errors.date ? errors.amount?.message : ""}
              />
              <Autocomplete
                id="category"
                freeSolo
                className="flex-3"
                options={categories.map((c) => c.name)}
                value={getValues("category_input")}
                // error={!!errors.date}
                // helperText={errors.date ? errors.date?.message : ""}
                onChange={(_e, v) => {
                  setCategoryValue(v);
                }}
                onInputChange={(_e, v, r) => {
                  if (r === "clear") {
                    setCategoryValue(null);
                    setValue("category_input", "");
                    return;
                  }
                  setValue("category_input", v);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...register("category_input")}
                    label="Category"
                    error={!!errors.category_input}
                    helperText={
                      errors.date ? errors.category_input?.message : ""
                    }
                  />
                )}
              />
              <Button
                type="button"
                variant="outlined"
                className="flex-2"
                size="small"
                onClick={() => setIsDescShowed((v) => !v)}
              >
                {isDescShowed ? "Remove" : "Add"} Description
              </Button>
            </div>
            <TextareaAutosize
              style={{
                display: isDescShowed ? "block" : "none",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: 4,
                marginTop: 20,
                maxHeight: "50vh",
              }}
              minRows={3}
              maxRows={10}
              {...register("description")}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2, px: 4 }}>
              Save
            </Button>
          </form>
          <CategoryAddModal
            categoryName={getValues("category_input")}
            open={childOpen}
            setOpen={setChildOpen}
            resolveRef={modalResolveRef}
          />
        </Paper>
      </Modal>
    </Box>
  );
};
const CategoryAddModal: React.FC<{
  categoryName: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  resolveRef: RefObject<(value: "submit" | "cancel") => void>;
}> = ({ categoryName, open, setOpen, resolveRef }) => {
  const handleClick = (result: "submit" | "cancel") => {
    setOpen(false);
    resolveRef.current?.(result);
  };
  const saveCategory = useApiGroupCategoriesCreate();
  const queryClient = useQueryClient();
  const { group } = useGroup();
  const handleSaveCategory = async () => {
    await saveCategory
      .mutateAsync({
        groupName: group,
        data: {
          name: categoryName,
        },
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["category", group] });
        console.log("category created");
      })
      .catch((err) => console.error(err));
  };
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={modalStyles}>
        <Typography variant="h6" component="h2">
          There is a new category "{categoryName}"
        </Typography>
        <Typography variant="body1" mb={2}>
          Do you want to add it?
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={async () => {
              await handleSaveCategory();
              handleClick("submit");
            }}
          >
            Add & Submit
          </Button>
          <Button variant="outlined" onClick={() => handleClick("submit")}>
            Submit whitout adding
          </Button>
          <Button variant="text" onClick={() => handleClick("cancel")}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ExpenseAddForm;
