import { createContext, SetStateAction, useEffect, useState } from "react";
import { useApiGroupsList } from "../api/api/api";
import { CircularProgress } from "@mui/material";
import { contextDefaults, GroupContextProps } from "./contextProps";

export const AuthGroupContext =
  createContext<GroupContextProps>(contextDefaults);
export const AuthGroupsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [group, setGroup] = useState("");
  const groups = useApiGroupsList({ query: { queryKey: ["groups"] } });

  const setGroupManually = (value: SetStateAction<string>) => {
    setGroup(value);
    localStorage.setItem("selectedGroup", value.toString());
  };

  useEffect(() => {
    if (!groups.isSuccess || !groups.data.length) return;
    const storage = localStorage.getItem("selectedGroup");
    const groupsExists = storage && groups.data.some((g) => g.slug === storage);
    if (!groupsExists) {
      setGroupManually(groups.data[0].slug);
    } else {
      setGroup(storage);
    }
  }, [groups]);

  if (groups.isError) {
    return (
      <AuthGroupContext.Provider
        value={{ ...contextDefaults, state: groups.status }}
      >
        {groups.error.message}
      </AuthGroupContext.Provider>
    );
  }
  if (groups.isLoading) {
    return (
      <AuthGroupContext.Provider
        value={{ ...contextDefaults, state: groups.status }}
      >
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
      </AuthGroupContext.Provider>
    );
  }
  if (groups.isSuccess) {
    return (
      <AuthGroupContext.Provider
        value={{
          ...contextDefaults,
          groups: groups.data,
          state: groups.status,
          selectedGroup: group,
          setGroup: setGroupManually,
        }}
      >
        {children}
      </AuthGroupContext.Provider>
    );
  }
};
