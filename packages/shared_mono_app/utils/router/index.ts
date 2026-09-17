export type RouterLike = {
  push: (path: string) => void;
  replace?: (path: string) => void;
};

export declare function useRouter(): RouterLike;

export declare const Link: any;
