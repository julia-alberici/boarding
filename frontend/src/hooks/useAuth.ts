import { useState, useEffect } from 'react';

export function useAuth() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // placeholder: load user from localStorage or api
        const raw = localStorage.getItem('user');
        if (raw) setUser(JSON.parse(raw));
    }, []);

    function login(u: any) {
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
    }

    function logout() {
        setUser(null);
        localStorage.removeItem('user');
    }

    return { user, login, logout };
}
