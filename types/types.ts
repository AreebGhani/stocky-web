export type LinkPath = {
    name: string,
    path: string,
    icon?: string,
    width?: number,
    height?: number,
}

export type Field = {
    type: string,
    name: string,
    placeholder: string,
    icon: string,
    width: number,
    height: number,
    label?: string,
}

export type SignupData = {
    username: string;
    password: string;
    confirmPassword: string;
    referral: string;
    checkbox: boolean;
};

export type SignupEmail = SignupData & {
    email: string;
};

export type SignupPhone = SignupData & {
    phone: string;
};

export type Signup = SignupEmail | SignupPhone;

export type LoginEmail = {
    email: string,
    password: string,
    checkbox: boolean,
}

export type LoginPhone = {
    phone: string,
    password: string,
    checkbox: boolean,
}

export type User = {
    username: string,
    email?: string,
    phone?: string,
    password: string,
    confirmPassword: string,
    referral: string,
    checkbox: boolean,
}

export type SignupResponse = {
    success: boolean,
    data?: {
        token: string,
        email?: string,
        phone?: string,
    },
    error?: {
        key: string,
        message: string,
    }
}

export type LongTermStock = {
    id: number,
    img: string,
    width: number,
    height: number,
}

export type DailyStock = LongTermStock & {
    title: string,
    description: string,
    percentage: number,
}

export type sessionData = {
    user: { balance: number, diamonds: number, email: string, id: string, phone: string, referral: string, picture: string, role: string, rank: number, teamCommission: number, username: string },
    expires: string,
}

export type Referral = {
    id: string;
    username: string;
    email: string;
    phone: string;
    picture: string | null;
    rank: number;
    referrerId?: string | null;
    referrals?: Referral[] | null;
    balance: number;
    diamonds: number;
    teamCommission: number;
    createdAt: Date;
    updatedAt: Date;
};

export type UserDataType = {
    balance: number,
    diamonds: number,
    picture: string | null,
    rank: number,
    stockingBalance: number,
    todayProfit: number,
    referralChain: Referral
}

export type UserDataResponse = {
    success: boolean;
    data?: UserDataType;
    message?: string
}

export type UserTransaction = {
    id: string;
    transactionId: string;
    userId: string;
    amount: number;
    type: 'WITHDRAW' | 'DEPOSIT';
    createdAt: Date;
    updatedAt: Date;
}

export type WithdrawRequest = {
    id: string;
    userId: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}

export type DepositRequest = {
    id: string;
    userId: string;
    amount: number;
    transactionId: string;
    complete: boolean;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type Reward = {
    reward: number;
    purchase: number;
    img: string;
    btnText: string;
}

export type CheckRewardsResponse = {
    success: boolean;
    message?: string
    data?: {
        rewards: number | number[];
        received: {
            id: string;
            claimDiamonds3: boolean;
            claimDiamonds6: boolean;
            claimDiamonds10: boolean;
            claimDiamonds20: boolean;
            claimDiamonds50: boolean;
            claimDiamonds70: boolean;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
        }
    };
}

export type UpdateUser = {
    username: string;
    email: string;
    phone: string;
    role: string;
    rank: number;
    secret: string;
    balance: number;
    diamonds: number;
    teamCommission: number;
}