"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  console.log(router);
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            signIn("google", {
              callbackUrl: "/dashboard",
            });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 mr-2"
          >
            <path
              d="M23.999 7.818l-6.81-4.744c-1.131-.756-2.616-.755-3.746 0l-6.79 4.77 1.57 6.233c.313 1.174.314 2.349 0 3.523L5.424 22l6.916-4.817c1.13-.76 2.617-.76 3.746 0l6.79 4.772 1.57-6.233c.314-1.174.314-2.349 0-3.523L23.999 7.818z"
              fill="#4285F4"
            />
            <path
              d="M12.568 15.422c-.76.57-1.735.9-2.827.9-1.096 0-2.072-.33-2.83-1.09L3.082 12l4.656-3.476c.76-.57 1.735-.9 2.827-.9 1.094 0 2.068.33 2.828 1.09l4.655 3.475-4.655 3.475z"
              fill="#34A853"
            />
            <path
              d="M7.377 19.2c-.18-.54-.282-1.11-.282-1.71s.103-1.17.283-1.71l-.087-2.832c-.087-.267-.138-.556-.138-.865s.05-.598.138-.864l.087-2.832c-.18-.54-.283-1.11-.283-1.71s.103-1.17.283-1.71l-.087-2.832c-.087-.267-.138-.556-.138-.865s.05-.598.138-.864l.087-2.832c-.76.57-1.735.9-2.827.9-1.096 0-2.072-.33-2.83-1.09L.165 5.087C-.03 4.55-.03 3.99 0 3.45l.087-2.832c.087-.267.138-.556.138-.865s-.05-.598-.138-.864L.165.165C-.03-.385-.03-1.02 0-1.575l.087-2.832c.76-.57 1.735-.9 2.827-.9 1.094 0 2.068.33 2.828 1.09l4.655 3.476-4.655 3.475z"
              fill="#FBBC05"
            />
            <path
              d="M19.552 3.828l-4.655-3.475c-.76-.57-1.735-.9-2.827-.9-1.094 0-2.068.33-2.828 1.09l-4.655 3.475 4.655 3.476c.76.57 1.735.9 2.827.9 1.096 0 2.072-.33 2.83-1.09l4.656-3.476 1.57 6.233c.313 1.174.314 2.349 0 3.523L19.552 3.828z"
              fill="#EA4335"
            />
          </svg>
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
