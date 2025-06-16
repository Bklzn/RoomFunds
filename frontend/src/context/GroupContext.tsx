import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApiGroupCategoriesList, useApiGroupsList } from "../api/api/api";
import { Category } from "../api/model";

interface GroupContextProps {
  group: string;
  setGroup: (value: SetStateAction<string>) => void;
  categories: Category[];
}

const GroupContext = createContext<GroupContextProps>({
  group: "",
  setGroup: () => {},
  categories: [],
});
export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const groups = useApiGroupsList();
  const storage = localStorage.getItem("selectedGroup");
  const [group, setGroup] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const categoriesApi = useApiGroupCategoriesList(group, {
    query: {
      queryKey: ["category", group],
    },
  });

  useEffect(() => {
    if (groups.isSuccess) {
      if (!storage || !groups.data.some((g) => g.name === storage)) {
        setGroup(groups.data[0].name);
        localStorage.setItem("selectedGroup", groups.data[0].name);
      } else {
        setGroup(storage);
      }
    }
    if (categoriesApi.isSuccess) setCategories(categoriesApi.data);
  }, [groups.data, groups, storage, categoriesApi]);

  const setGroupManually = (value: SetStateAction<string>) => {
    setGroup(value);
    localStorage.setItem("selectedGroup", value.toString());
  };

  if (groups.isError) {
    return <>{groups.error}</>;
  }
  if (groups.isLoading || !group) {
    return <>loading</>;
  }
  if (groups.isSuccess) {
    return (
      <GroupContext.Provider
        value={{ group, setGroup: setGroupManually, categories }}
      >
        {children}
      </GroupContext.Provider>
    );
  }
};
export const useGroup = () => {
  const ctx = useContext(GroupContext);
  if (!ctx) {
    throw new Error("useGroup must be used within a GroupProvider");
  }
  return ctx;
};
