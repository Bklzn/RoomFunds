import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Skeleton,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import {
  ChangeEvent,
  Dispatch,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
import {
  useApiExpensesCreate,
  useApiGroupCategoriesCreate,
  useApiGroupCategoriesList,
} from "../api/api/api";
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
  const [childOpen, setChildOpen] = useState(false);
  const [isDescShowed, setIsDescShowed] = useState(false);
  const [categoryValue, setCategoryValue] = useState<string | null>(null);
  const { group } = useGroup();
  const categories = useApiGroupCategoriesList(group);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormProps>({
    date: "",
    amount: "0",
    category: "",
    description: "",
    group: "",
  });
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(categoryValue, "-", formData.category);
    if (categoryValue === null) {
      if (formData.category === "") {
        console.error("Category is not selected");
        return;
      }
      const isNewCategory = !categories.data?.some(
        (c) => c.name === formData.category
      );

      if (isNewCategory) {
        const result = await showCategoryModal();
        if (result === "cancel") return;
      }
    }
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
              {categories.isLoading ? (
                <Skeleton animation="wave" sx={{ height: 50 }} />
              ) : categories.isError ? (
                <Typography>{categories.error.message}</Typography>
              ) : (
                <>
                  <Autocomplete
                    id="category"
                    freeSolo
                    className="flex-3"
                    options={categories.data!.map((c) => c.name)}
                    value={categoryValue}
                    onChange={(_e, v) => {
                      setCategoryValue(v);
                    }}
                    onInputChange={(_e, v, r) => {
                      setCategoryValue(null);
                      if (r === "clear") {
                        handleChange({
                          target: { name: "category", value: "" },
                        } as ChangeEvent<HTMLInputElement>);
                        return;
                      }
                      handleChange({
                        target: { name: "category", value: v },
                      } as ChangeEvent<HTMLInputElement>);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        name="category"
                        value={formData.category}
                      />
                    )}
                  />
                </>
              )}
              {/* <TextField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="flex-3"
              /> */}
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
          <CategoryAddModal
            categoryName={formData.category}
            open={childOpen}
            setOpen={setChildOpen}
            resolveRef={modalResolveRef}
          />
        </Box>
      </Modal>
    </>
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
