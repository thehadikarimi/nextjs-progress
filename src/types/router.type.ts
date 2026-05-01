import type { useRouter } from 'next/navigation';

export type AppRouterInstance = ReturnType<typeof useRouter>;
export type NavigateOptions = Parameters<AppRouterInstance['push']>[1];
export type PrefetchOptions = Parameters<AppRouterInstance['prefetch']>[1];
export type { PrefetchKind } from 'next/dist/client/components/router-reducer/router-reducer-types';
