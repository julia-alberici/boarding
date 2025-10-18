import { useState, useEffect } from 'react';
import api from '../services/api';

export function useApi<T = any>(path: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        api
            .get(path)
            .then((res: any) => {
                if (mounted) setData(res.data);
            })
            .catch((err: any) => {
                if (mounted) setError(err);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [path]);

    return { data, loading, error };
}
