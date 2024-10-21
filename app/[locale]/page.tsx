
import { ThemeModeToggle } from "@/components/ThemeModeToggle";
import { Signika } from "next/font/google";
import Image from "next/image";
import { FacebookSignIn } from "../components/facebookSignIn";
import { GoogleSignIn } from "../components/googleSignIn";
import { Nuqs } from "../components/nuqsForm";
import { Button } from "@/components/ui/button";
import { dialogStore } from "../components/DialogMessage";
import { DialogDemo } from "../components/dialogDemo";

export default function Home() {
  
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <div className="z-10 flex-col items-center justify-between w-full max-w-5xl font-mono text-sm lg:flex">
        <ThemeModeToggle />
        <FacebookSignIn />
        <GoogleSignIn />
        
        <DialogDemo />
        <Nuqs />
        <p className="fixed top-0 left-0 flex justify-center w-full pt-8 pb-6 border-b border-gray-300 lg:static dark:border-neutral-800 lg:bg-gray-200 lg:dark:bg-zinc-800/30 dark:bg-zinc-800/30 bg-gradient-to-b from-zinc-200 dark:from-inherit backdrop-blur-2xl lg:p-4 lg:border lg:rounded-xl lg:w-auto">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex items-end justify-center w-full h-48 lg:static bg-gradient-to-t from-white dark:from-black via-white dark:via-black lg:bg-none lg:size-auto">
          <a
            className="flex gap-2 p-8 pointer-events-none place-items-center lg:p-0 lg:pointer-events-auto"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative z-[-1] after:-z-20 before:absolute after:absolute flex place-items-center before:content-[''] after:content-[''] before:bg-gradient-radial before:dark:bg-gradient-to-br after:bg-gradient-conic before:from-white before:dark:from-transparent after:from-sky-200 after:dark:from-sky-900 after:via-blue-200 after:dark:via-[#0141ff] before:to-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:opacity-40 before:blur-2xl after:blur-2xl before:rounded-full sm:before:w-[480px] sm:after:w-[240px] before:w-full after:w-full before:lg:h-[360px] before:h-[300px] after:h-[180px] before:-translate-x-1/2 after:translate-x-1/3">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="grid mb-32 text-center lg:grid-cols-4 bg-red-5000 lg:mb-0 lg:w-full lg:max-w-5xl lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="px-5 py-4 transition-colors border border-transparent rounded-lg hover:border-gray-300 hover:dark:border-neutral-700 hover:bg-gray-100 hover:dark:bg-neutral-800/30 group"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{" "}
            <span className="inline-block transition-transform motion-reduce:transform-none group-hover:translate-x-1">
              -&gt;
            </span>
          </h2>
          <p className="opacity-50 m-0 max-w-[30ch] text-sm">
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="px-5 py-4 transition-colors border border-transparent rounded-lg hover:border-gray-300 hover:dark:border-neutral-700 hover:bg-gray-100 hover:dark:bg-neutral-800/30 group"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Learn{" "}
            <span className="inline-block transition-transform motion-reduce:transform-none group-hover:translate-x-1">
              -&gt;
            </span>
          </h2>
          <p className="opacity-50 m-0 max-w-[30ch] text-sm">
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="px-5 py-4 transition-colors border border-transparent rounded-lg hover:border-gray-300 hover:dark:border-neutral-700 hover:bg-gray-100 hover:dark:bg-neutral-800/30 group"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Templates{" "}
            <span className="inline-block transition-transform motion-reduce:transform-none group-hover:translate-x-1">
              -&gt;
            </span>
          </h2>
          <p className="opacity-50 m-0 max-w-[30ch] text-sm">
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="px-5 py-4 transition-colors border border-transparent rounded-lg hover:border-gray-300 hover:dark:border-neutral-700 hover:bg-gray-100 hover:dark:bg-neutral-800/30 group"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">

            Deploy{" "}
            <span className="inline-block transition-transform motion-reduce:transform-none group-hover:translate-x-1">
              -&gt;
            </span>
          </h2>
          <p className="opacity-50 m-0 max-w-[30ch] text-balance text-sm">
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
