"use client";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/trpc";

export default function RcProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
