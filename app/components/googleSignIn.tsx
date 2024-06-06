import { signIn } from "@/auth";

export function GoogleSignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button className="bg-white" type="submit">
        Signin with Google {process.env.AUTH_GOOGLE_ID}
      </button>
    </form>
  );
}
