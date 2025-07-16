import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      roles: ("staff" | "student" | "parent")[];
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    roles: ("staff" | "student" | "parent")[];
  }

  interface JWT {
    id: string;
    roles: ("staff" | "student" | "parent")[];
    user: User;
  }
}
