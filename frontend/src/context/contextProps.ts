import { SetStateAction } from "react";
import { Category, Group, User } from "../api/model";

export interface GroupContextProps {
  groups: Group[];
  selectedGroup: string;
  setGroup: (value: SetStateAction<string>) => void;
  categories: Category[];
  users: User[];
  state: "loading" | "success" | "error" | "empty";
}

export const contextDefaults: GroupContextProps = {
  groups: [],
  selectedGroup: "",
  setGroup: () => {},
  categories: [],
  users: [],
  state: "loading",
};
