import { signIn } from "@/auth";

export function FacebookSignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("facebook");
      }}
    >
      <button className="bg-blue-500" type="submit">
        Signin with Facebook {process.env.AUTH_FACEBOOK_ID}
      </button>
    </form>
  );
}
