import { useAuthStore } from '../../store/auth.store';
import { Button } from '../UI/Button';

export const Header = () => {
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="shadow-sm shadow-secondary bg-popover">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Boarding</h1>
                <div className="flex items-center gap-4">
                    <span className="">
                        {user?.name}
                    </span>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                    >
                        Sair
                    </Button>
                </div>
            </div>
        </header>
    );
};