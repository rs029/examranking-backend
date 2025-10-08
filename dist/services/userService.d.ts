export declare const getUsers: () => import(".prisma/client").Prisma.PrismaPromise<{
    id: number;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare const createUser: (name: string, email: string, password: string) => Promise<{
    id: number;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const loginUser: (email: string, password: string) => Promise<{
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
//# sourceMappingURL=userService.d.ts.map