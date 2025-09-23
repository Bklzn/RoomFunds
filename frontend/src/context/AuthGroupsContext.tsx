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

    if (!storage || !groups.data.some((g) => g.name === storage)) {
      setGroupManually(groups.data[0].name);
    } else {
      setGroup(storage);
    }
  }, [groups]);

  if (groups.isError) {
    return (
      <AuthGroupContext.Provider value={{ ...contextDefaults, state: "error" }}>
        {groups.error.message}
      </AuthGroupContext.Provider>
    );
  }
  if (groups.isLoading) {
    return (
      <AuthGroupContext.Provider
        value={{ ...contextDefaults, state: "loading" }}
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
          state: "success",
          selectedGroup: group,
          setGroup: setGroupManually,
        }}
      >
        {children}
      </AuthGroupContext.Provider>
    );
  }
};
