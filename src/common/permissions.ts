import { UserRole } from "@prisma/client";

export const Permissions = {
   CREATE: "CREATE",
   READ: "READ",
   UPDATE: "UPDATE",
   SOFT_DELETE: "SOFT_DELETE",
   HARD_DELETE: "HARD_DELETE",
   SOFT_DELETE_ALL: "SOFT_DELETE_ALL"
} as const;

export type IPermission = (typeof Permissions)[keyof typeof Permissions];

export const RolePermissions = {
   [UserRole.MEMBER]: [Permissions.READ, Permissions.CREATE] as IPermission[],
   [UserRole.MANAGER]: [
      Permissions.READ,
      Permissions.CREATE,
      Permissions.UPDATE,
      Permissions.SOFT_DELETE
   ] as IPermission[],
   [UserRole.ADMIN]: [
      Permissions.READ,
      Permissions.CREATE,
      Permissions.UPDATE,
      Permissions.SOFT_DELETE,
      Permissions.HARD_DELETE,
      Permissions.SOFT_DELETE_ALL
   ] as IPermission[]
} as const;

export const checkPermission = (role: UserRole, permissions: IPermission[]): boolean => {
   const rolePermissions = RolePermissions[role];
   return permissions.some((permission) => rolePermissions.includes(permission));
};
