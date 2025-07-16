import { UserRole } from "@prisma/client";

const allAllowed = [UserRole.MEMBER, UserRole.MANAGER, UserRole.ADMIN];

export const publicRoutes = ["/login", "/auth/verify-token", "/unauthorized", "/example"];

export const routesPermissions = [
   {
      path: "/",
      rolesAllowed: allAllowed
   },
   {
      path: "/admin-page",
      rolesAllowed: [UserRole.ADMIN]
   },
   {
      path: "/member-page",
      rolesAllowed: [UserRole.MEMBER]
   },
   {
      path: "/posts",
      rolesAllowed: allAllowed
   }
];
