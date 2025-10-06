import { useQueryClient } from "@tanstack/react-query";
import { Group } from "../api/model";
import { useGroup } from "../context/GroupContext";

export const useHandleLocalGroupDeletation = () => {
  const queryClient = useQueryClient();
  const { setGroup, selectedGroup } = useGroup();

  const handleMutation = async () => {
    queryClient.invalidateQueries({
      queryKey: ["group", selectedGroup],
    });
    queryClient.invalidateQueries({
      queryKey: ["expenses", selectedGroup],
    });
    await queryClient.fetchQuery({ queryKey: ["groups"] }).then((value) => {
      const groups = value as Group[];
      if (!groups || groups.length === 0) {
        localStorage.removeItem("selectedGroup");
        return;
      }
      setGroup(groups[0].slug);
    });
  };

  return { handleMutation };
};
