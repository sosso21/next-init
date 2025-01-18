"use client";

import { sayHello } from "@/server/action";
import { useMutation, useQuery } from "@tanstack/react-query";

export const Ping = () => {
  useQuery({
    queryKey: ["sayHello"],
    queryFn: () =>
      sayHello({ width: window.screen.width, height: window.screen.height }),
  });

  return <> </>;
};
