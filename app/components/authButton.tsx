import { signIn } from "@/auth";
import { BottomGradient } from "@/components/BottomGradient";
import { cn } from "@/lib/utils";
import { signInWithProvider } from "@/server/action";
import { AuthProviderEnum } from "@/server/type";

export function AuthButton({
  children,
  className,
  provider,
}: {
  children: React.ReactNode;
  className?: string;
  provider: AuthProviderEnum;
}) {
  return (
    <form
      action={async () => {
        await signInWithProvider(provider);
      }}
    >
      <button
        className={cn(
          "relative flex justify-center items-center space-x-2 bg-secondary shadow-input dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] px-4 rounded-md w-full h-10 font-medium text-secondary-foreground group/btn",
          className
        )}
        type="submit"
      >
        {children}
        <BottomGradient />
      </button>
    </form>
  );
}
