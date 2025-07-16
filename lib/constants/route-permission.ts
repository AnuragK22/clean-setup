export const ROLE_ROUTES = {
  staff: ["/staff", "/admin", "/dashboard"],
  student: ["/student", "/dashboard"],
  parent: ["/parent", "/dashboard"],
} as const;

export const DEFAULT_ROUTES = {
  staff: "/staff",
  student: "/student",
  parent: "/parent",
} as const;

export type Role = keyof typeof ROLE_ROUTES;
export type AppRoute = (typeof ROLE_ROUTES)[Role][number];
