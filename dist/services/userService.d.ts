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
export declare const getUserDashboardData: (userId: number) => Promise<{
    stats: {
        totalCalculations: number;
        thisMonthCalculations: number;
    };
    recentActivity: {
        exam: string;
        date: string;
        rank: string;
        score: number;
        status: string;
    }[];
    achievements: {
        title: string;
        description: string;
        earned: boolean;
    }[];
}>;
//# sourceMappingURL=userService.d.ts.map