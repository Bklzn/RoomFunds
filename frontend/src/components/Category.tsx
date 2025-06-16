import { Chip } from "@mui/material";
import { useGroup } from "../context/GroupContext";

interface Props {
  categoryId: string;
}

const Category: React.FC<Props> = ({ categoryId }) => {
  const { categories } = useGroup();

  const filteredCategories = categories.filter(
    (c) => String(c.id) == categoryId
  );

  return filteredCategories.length > 0 ? (
    <Chip label={filteredCategories[0].name} />
  ) : (
    categoryId
  );
};

export default Category;
