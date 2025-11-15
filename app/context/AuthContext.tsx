import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { api } from "../../helper/api";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);

    const login = async (email: string, password: string) => {
        try {
            const res = await axios.post(`${api}login.php?action=login`, {
                email,
                password,
            });

            if (res.data.success) {
                setUser(res.data.user);
                return { ok: true, user: res.data.user };
            }
            return { ok: false, error: res.data.error };
        } catch {
            return { ok: false, error: "Error de conexión" };
        }
    };

    const register = async (nombre: string, email: string, password: string) => {
        try {
            const res = await axios.post(`${api}login.php?action=register`, {
                nombre,
                email,
                password,
            });
            if (res.data.success) return { ok: true, user: res.data.user };
            return { ok: false, error: res.data.error };
        } catch {
            return { ok: false, error: "Error de conexión" };
        }
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
