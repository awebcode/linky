export interface ModifyUserGroupsParams {
  userId: string;
  groupIds: string | string[];
  operation: "add" | "remove";
}
