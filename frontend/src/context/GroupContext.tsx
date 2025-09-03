import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useApiGroupCategoriesList,
  useApiGroupsList,
  useApiGroupUsersList,
} from "../api/api/api";
import { Category, Group, User } from "../api/model";
import NoGroupsHandler from "../components/NoGroupsHandler";
import GroupBasics from "../components/GroupBasics";
import { CircularProgress } from "@mui/material";

interface GroupContextProps {
  group: string;
  setGroup: (value: SetStateAction<string>) => void;
  categories: Category[];
  users: User[];
  state: "loading" | "success" | "error" | "empty";
}

const contextDefaults: GroupContextProps = {
  group: "",
  setGroup: () => {},
  categories: [],
  users: [],
  state: "loading",
};

const GroupContext = createContext<GroupContextProps>(contextDefaults);
export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const groups = useApiGroupsList({ query: { queryKey: ["groups"] } });

  if (groups.isError) {
    return (
      <GroupContext.Provider value={{ ...contextDefaults, state: "error" }}>
        <GroupBasics />
        {groups.error.message}
      </GroupContext.Provider>
    );
  }
  if (groups.isLoading) {
    return (
      <GroupContext.Provider value={{ ...contextDefaults, state: "loading" }}>
        <GroupBasics />
        <CircularProgress
          color="inherit"
          size={50}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </GroupContext.Provider>
    );
  }
  if (groups.isSuccess) {
    if (!groups.data.length) {
      return (
        <GroupContext.Provider value={{ ...contextDefaults, state: "empty" }}>
          <GroupBasics />
          <NoGroupsHandler />
        </GroupContext.Provider>
      );
    }
    return (
      <GroupsProvider
        groups={groups.data}
        state={groups.data.length ? "success" : "error"}
      >
        <GroupBasics />
        {children}
      </GroupsProvider>
    );
  }
};

const GroupsProvider: React.FC<{
  children: React.ReactNode;
  groups: Group[];
  state: GroupContextProps["state"];
}> = ({ children, groups }) => {
  const storage = localStorage.getItem("selectedGroup");
  const [group, setGroup] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const usersApi = useApiGroupUsersList(group, {
    query: {
      queryKey: ["users", group],
    },
  });
  const categoriesApi = useApiGroupCategoriesList(group, {
    query: {
      queryKey: ["category", group],
    },
  });

  const setGroupManually = (value: SetStateAction<string>) => {
    setGroup(value);
    localStorage.setItem("selectedGroup", value.toString());
  };

  useEffect(() => {
    if (!storage || !groups.some((g) => g.name === storage)) {
      setGroup(groups[0].name);
      localStorage.setItem("selectedGroup", groups[0].name);
    } else {
      setGroup(storage);
    }
    if (categoriesApi.isSuccess) setCategories(categoriesApi.data);
    if (usersApi.isSuccess) setUsers(usersApi.data);
  }, [
    categoriesApi.data,
    categoriesApi.isSuccess,
    groups,
    storage,
    usersApi.data,
    usersApi.isSuccess,
  ]);

  if (usersApi.isError || categoriesApi.isError) {
    return (
      <GroupContext.Provider
        value={{
          ...contextDefaults,
          group,
          setGroup: setGroupManually,
          state: "success",
        }}
      >
        <GroupBasics />
        {usersApi.error?.message}
        {categoriesApi.error?.message}
      </GroupContext.Provider>
    );
  }

  if (usersApi.isLoading || categoriesApi.isLoading) {
    return (
      <GroupContext.Provider
        value={{
          ...contextDefaults,
          group,
          setGroup: setGroupManually,
          state: "success",
        }}
      >
        <GroupBasics />
        <CircularProgress
          color="inherit"
          size={50}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </GroupContext.Provider>
    );
  }

  return (
    <GroupContext.Provider
      value={{
        group,
        setGroup: setGroupManually,
        categories,
        users,
        state: "success",
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
export const useGroup = () => {
  const ctx = useContext(GroupContext);
  if (!ctx) {
    throw new Error("useGroup must be used within a GroupProvider");
  }
  return ctx;
};
