import { SetStateAction } from "react";
import { Category, Group, User } from "../api/model";
import { ApiGroupRetrieveQueryResult } from "../api/api/api";
import { UseQueryResult } from "@tanstack/react-query";

export interface GroupContextProps {
  groups: Group[];
  selectedGroup: string;
  setGroup: (value: SetStateAction<string>) => void;
  categories: Category[];
  users: User[];
  state: UseQueryResult<ApiGroupRetrieveQueryResult>["status"];
}

export const contextDefaults: GroupContextProps = {
  groups: [],
  selectedGroup: "",
  setGroup: () => {},
  categories: [],
  users: [],
  state: "pending",
};
