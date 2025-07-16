import { routesPermissions } from "@/config/route-control";
import type { UserRole } from "@prisma/client";

export const checkRoutePermission = (path: string, role: UserRole): boolean => {
   for (const route of routesPermissions) {
      if (path === route.path) {
         return route.rolesAllowed.includes(role);
      }

      const dynamicPattern = route.path.replace(/\[([^\]]+)\]/g, "([^/]+)");
      const regex = new RegExp(`^${dynamicPattern}$`);
      if (regex.test(path)) {
         return route.rolesAllowed.includes(role);
      }
   }

   return false;
};
