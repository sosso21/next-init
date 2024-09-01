'use client';

import { sayHello } from '@/server/action';
import { useMutation, useQuery } from '@tanstack/react-query';

export const Ping = () => {
  useQuery({
    queryKey: ['sayHello'],
    queryFn: () => sayHello(),
  });

  return <> </>;
};
