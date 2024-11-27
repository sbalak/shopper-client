import  { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import {AUTH_URL, API_URL} from '@env';

const initialState = {
    authState: { token: null, userId: null, authenticated: null }, register: async () => {}, login: async () => {}, logout: async () => {}
}

type AuthContextType = {
    authState: { token: string | null, userId: string | null, authenticated: boolean | null };
    register: (email: string, password: string) => Promise<any>;
    login: (email: string, password: string) => Promise<any>;
    logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType>(initialState);

interface Props extends PropsWithChildren {}

const AuthProvider: React.FC<Props> = ({ children }) => {
    const [authState, setAuthState] = useState<{ token: string | null, userId: string | null, authenticated: boolean | null }>({ token: null, userId: null, authenticated: null });

    useEffect(() => {
        const loadAccessToken = async () => {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            const userId = await SecureStore.getItemAsync('userId');
            
            if (accessToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                setAuthState({
                    token: accessToken,
                    userId: userId,
                    authenticated: true
                });        
            }
            else {
                setAuthState({
                    token: null, 
                    userId: null,
                    authenticated: false
                });
            }  
        };

        axios.interceptors.request.use(async (request) => {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            if (accessToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            }
            return request;
          }, error => {
            return Promise.reject(error);
          });

        // Add a response interceptor
        axios.interceptors.response.use(
            response => response, 
            async (error) => {
                const originalRequest = error.config;
                let retry = 0;
                if (error.response.status === 401 && !originalRequest._retry) {                    
                    const refreshToken = await SecureStore.getItemAsync('refreshToken');
                    
                    const response = await axios.post(`${AUTH_URL}/refresh`, { refreshToken });

                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

                    await SecureStore.setItem('accessToken', response.data.accessToken);
                    await SecureStore.setItem('refreshToken', response.data.refreshToken);

                    originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.

                    const retryRequest = await axios(originalRequest);

                    return retryRequest; // Retry the original request with the new access token.
                }
                return Promise.reject(error);
            }
        );

        loadAccessToken();
    }, []);

    const register = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${AUTH_URL}/register`, { email, password });

            return response;
        } catch (error) {
            return { error: true, message: (error as any).response.data };
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${AUTH_URL}/login`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email, 
                    password: password 
                }),
            });

            const data = await response.json();

            if (data.status === 401){
                return data;
            }
            
            await SecureStore.setItem('accessToken', data.accessToken);
            await SecureStore.setItem('refreshToken', data.refreshToken);

            axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

            const user = await axios.get(`${API_URL}/user/id?email=${email}`);

            await SecureStore.setItem('userId', String(user.data));

            setAuthState({
                token: data.accessToken,
                userId: user.data,
                authenticated: true
            });

            return data;
        } catch (error) {
            return { error: true, message: (error as any).response.data };
        }
    }

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('userId');

            setAuthState({
                token: null,
                userId: null,
                authenticated: false
            });          
            router.replace('/login');  
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