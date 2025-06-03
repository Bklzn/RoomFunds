import { Box, Chip, CircularProgress, Grid, Paper } from "@mui/material";
import { useApiGroupCategoriesList } from "../api/api/api";
import { useGroup } from "../context/GroupContext";

const Category: React.FC = () => {
  const { group } = useGroup();
  const categories = useApiGroupCategoriesList(group, {
    query: {
      queryKey: ["category", group],
    },
  });

  return (
    <Box sx={{ my: 3 }}>
      <h2>Categories</h2>
      <Paper sx={{ p: 1 }}>
        {categories.isLoading ? (
          <CircularProgress />
        ) : categories.isError ? (
          <p>{categories.error.message}</p>
        ) : (
          <Grid container spacing={1} sx={{ flexWrap: "wrap" }}>
            {categories.data!.map((c, i) => (
              <Chip label={c.name} key={`${i}-${c}`} />
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default Category;
