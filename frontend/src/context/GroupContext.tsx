import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApiGroupsList } from "../api/api/api";

interface GroupContextProps {
  group: string;
  setGroup: (value: SetStateAction<string>) => void;
}

const GroupContext = createContext<GroupContextProps>({
  group: "",
  setGroup: () => {},
});
export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const groups = useApiGroupsList();
  const storage = localStorage.getItem("selectedGroup");
  const [group, setGroup] = useState("");

  useEffect(() => {
    if (groups.isSuccess) {
      if (!storage || !groups.data.some((g) => g.name === storage)) {
        setGroup(groups.data[0].name);
        localStorage.setItem("selectedGroup", groups.data[0].name);
      } else {
        setGroup(storage);
      }
    }
  }, [groups.data, groups, storage]);

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
      <GroupContext.Provider value={{ group, setGroup: setGroupManually }}>
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
