import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useApiGroupCategoriesList,
  useApiGroupUsersList,
} from "../api/api/api";
import { Category, User } from "../api/model";
import NoGroupsHandler from "../components/NoGroupsHandler";
import GroupBasics from "../components/GroupBasics";
import { CircularProgress } from "@mui/material";
import { contextDefaults, GroupContextProps } from "./contextProps";
import { AuthGroupContext } from "./AuthGroupsContext";

const GroupContext = createContext<GroupContextProps>(contextDefaults);

export const GroupProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { selectedGroup, ...rest } = useContext(AuthGroupContext);

  return selectedGroup ? (
    <SelectedGroupProvider contextProps={{ selectedGroup, ...rest }}>
      {children}
    </SelectedGroupProvider>
  ) : (
    <NoGroupProvider contextProps={{ selectedGroup, ...rest }} />
  );
};

const NoGroupProvider: React.FC<{ contextProps: GroupContextProps }> = ({
  contextProps,
}) => {
  return (
    <GroupContext.Provider value={contextProps}>
      <NoGroupsHandler />
    </GroupContext.Provider>
  );
};

const SelectedGroupProvider: React.FC<{
  children: React.ReactNode;
  contextProps: GroupContextProps;
}> = ({ children, contextProps }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const { selectedGroup, ...rest } = contextProps;
  const usersApi = useApiGroupUsersList(selectedGroup, {
    query: {
      queryKey: ["users", selectedGroup],
    },
  });
  const categoriesApi = useApiGroupCategoriesList(selectedGroup, {
    query: {
      queryKey: ["category", selectedGroup],
    },
  });

  useEffect(() => {
    if (categoriesApi.isSuccess) setCategories(categoriesApi.data);
    if (usersApi.isSuccess) setUsers(usersApi.data);
  }, [
    categoriesApi.data,
    categoriesApi.isSuccess,
    usersApi.data,
    usersApi.isSuccess,
  ]);

  if (usersApi.isError || categoriesApi.isError) {
    return (
      <GroupContext.Provider
        value={{
          ...rest,
          selectedGroup,
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
          ...rest,
          selectedGroup,
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
        ...rest,
        selectedGroup,
        categories,
        users,
        state: "success",
      }}
    >
      <GroupBasics />
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
