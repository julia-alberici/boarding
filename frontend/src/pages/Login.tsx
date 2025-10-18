import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { useAuthStore } from '../store/auth.store';
import { Card, CardContent } from "@/components/UI/card";
import { motion } from 'framer-motion';


const Login = () => {
    const navigate = useNavigate();
    const { login, isLoading, loginError: error } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] text-[#F5F5F5]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Card className="bg-[#121212] shadow-[0_0_30px_#E50914]/20 border border-[#1f1f1f] w-screen h-screen flex justify-center items-center xs:rounded-2xl xs:h-auto xs:display-initial xs:w-[360px]">
                    <CardContent className="p-8 flex flex-col gap-6">
                        <h1 className="text-xl font-semibold text-center tracking-wide text-[#ffffff]">Bem Vindo de Volta</h1>
                        <p className="text-sm text-center text-[#d0d0d0] mb-4">Entre na sua conta</p>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div>
                                <Input
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div>
                                <Input
                                    label="Senha"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="w-full mt-4 bg-[#E50914] hover:bg-[#8B0000] text-white rounded-xl py-2 font-medium transition-colors border border-transparent hover:border-[#E50914]">
                                Entrar
                            </Button>
                        </form>
                        <p className="text-center text-sm text-[#bbbbbb] mt-4">
                            Não tem uma conta?{' '}
                            <Link to="/register" className="text-[#E50914] hover:text-[#8B0000] hover:underline transition-colors">
                                Registre-se
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
