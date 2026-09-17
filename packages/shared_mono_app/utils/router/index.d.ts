export type RouterLike = {
  push: (path: string, params?: any) => void;
  replace?: (path: string, params?: any) => void;
  getParam: (key: string) => string | undefined;
};

export function useRouter(): RouterLike;

export const Link: any;
export function navigate(path: string, params?: any): void;
