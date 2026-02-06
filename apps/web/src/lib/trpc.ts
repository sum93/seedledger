import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import type { TransactionsRouter } from "transactions/types";

export const queryClient = new QueryClient();

const trpcClient = createTRPCClient<TransactionsRouter>({
  links: [httpLink({ url: "/api/transactions" })],
});

export const trpc = createTRPCOptionsProxy<TransactionsRouter>({
  client: trpcClient,
  queryClient,
});
