export declare const getUsers: () => Promise<{
    name: string | null;
    id: number;
    email: string;
    createdAt: Date;
}[]>;
export declare const createUser: (email: string, name: string) => Promise<{
    name: string | null;
    id: number;
    email: string;
    createdAt: Date;
}>;
//# sourceMappingURL=userService.d.ts.map