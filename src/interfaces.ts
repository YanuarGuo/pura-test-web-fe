export interface AuthInterface {
    jwtToken: string | null; // JWT Token
    userAccessCache: any; // Cached User Access
    userProfileCache: any; // Cached User Profile

    // Methods to manage user access and profiles
    getUserAccess: () => Promise<any>;
    setUserAccess: () => Promise<any>;
    getUserProfile: () => Promise<any>;
    setUserProfile: (token: string) => Promise<any>;
}

export interface CryptoService {
    getToken: () => string;
    setToken: (token: string) => string;
}