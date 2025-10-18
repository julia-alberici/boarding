import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { useAuthStore } from '../store/auth.store';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/UI/card';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { register, isLoading, registerError: error } = useAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!name || !email || !password) {
                setInternalError('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            if (password.length < 8) {
                setInternalError('A senha deve ter pelo menos 8 caracteres.');
                return;
            }
            setInternalError(null);
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
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
                        <h1 className="text-xl font-semibold text-center tracking-wide text-[#ffffff]">Olá</h1>
                        <p className="text-sm text-center text-[#d0d0d0] mb-4">Crie sua conta</p>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div>
                                <Input
                                    label="Nome"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Seu nome"
                                />
                            </div>

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

                            <div className='relative'>
                                <Input
                                    label="Senha"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 bottom-0 text-gray-500 hover:text-gray-700 !bg-transparent"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {(internalError ?? error) && (
                                <div className="text-red-500 text-sm text-center">
                                    {internalError ?? error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="w-full mt-4 bg-[#E50914] hover:bg-[#8B0000] text-white rounded-xl py-2 font-medium transition-colors border border-transparent hover:border-[#E50914]">
                                Criar conta
                            </Button>
                        </form>
                        <p className="text-center text-sm text-[#bbbbbb] mt-4">
                            Já tem uma conta?{' '}
                            <Link to="/login" className="text-[#E50914] hover:text-[#8B0000] hover:underline transition-colors">
                                Entre
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Register;