export declare const getUsers: () => import(".prisma/client").Prisma.PrismaPromise<{
    name: string;
    id: number;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare const createUser: (name: string, email: string, password: string) => Promise<{
    name: string;
    id: number;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const loginUser: (email: string, password: string) => Promise<{
    token: string;
    user: {
        name: string;
        id: number;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
//# sourceMappingURL=userService.d.ts.map