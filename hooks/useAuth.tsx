import  { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const API_URL = "https://shoppingcart-sandbox.azurewebsites.net";
const TOKEN_KEY = "accessToken";

const initialState = {
    authState: { token: null, authenticated: null }, register: async () => {}, login: async () => {}, logout: async () => {}
}

type AuthContextType = {
    authState: { token: string | null, authenticated: boolean | null };
    register: (email: string, password: string) => Promise<any>;
    login: (email: string, password: string) => Promise<any>;
    logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType>(initialState);

interface Props extends PropsWithChildren {}

const AuthProvider: React.FC<Props> = ({ children }) => {
    const [authState, setAuthState] = useState<{ token: string | null, authenticated: boolean | null }>({ token: null, authenticated: null });

    useEffect(() => {
        const loadToken = async () => {
            const token = null; //await AsyncStorage.getItem(TOKEN_KEY);
            console.log("Stored Token: ", token);
            
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setAuthState({
                    token: token,
                    authenticated: true
                });
            }
        };

        loadToken();
    }, []);

    const register = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/register`, { email, password });

            return response;
        } catch (error) {
            return { error: true, message: (error as any).response.data };
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
            //await AsyncStorage.setItem(TOKEN_KEY, response.data.accessToken);

            setAuthState({
                token: response.data.accessToken,
                authenticated: true
            });
            console.log("Login Response: ", response);

            return response;
        } catch (error) {
            return { error: true, message: (error as any).response.data };
        }
    }

    const logout = async () => {
        try {
            setAuthState({
                token: null,
                authenticated: false
            });            
        } catch (error) {
            return { error: true, message: (error as any).response.data };
        }
    }
    
    return <AuthContext.Provider value={{ authState, register, login, logout }}>{children}</AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth can be accessible only within the AuthProvider')
    }

    return context;
}