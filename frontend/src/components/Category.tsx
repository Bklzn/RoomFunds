import { Chip } from "@mui/material";
import { useGroup } from "../context/GroupContext";

interface Props {
  categoryId: string;
}

const Category: React.FC<Props> = ({ categoryId }) => {
  const { categories } = useGroup();

  const filteredCategories = categories.find((c) => String(c.id) == categoryId);

  return filteredCategories ? (
    <Chip label={filteredCategories.name} />
  ) : (
    categoryId
  );
};

export default Category;
