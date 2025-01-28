function AuthProvider({ children }) {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const login = async (username, password) => {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [
                {
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    role: 'admin',
                    permissions: ['all']
                },
                {
                    id: 2,
                    username: 'waiter',
                    password: 'waiter123',
                    role: 'waiter',
                    permissions: ['dashboard.view', 'tables.view', 'tables.edit', 'orders.view', 'orders.edit', 'menu.view']
                },
                {
                    id: 3,
                    username: 'receptionist',
                    password: 'reception123',
                    role: 'receptionist',
                    permissions: ['dashboard.view', 'rooms.view', 'rooms.edit', 'tables.view']
                }
            ];

            const foundUser = users.find(u => u.username === username && u.password === password);
            if (!foundUser) throw new Error('Invalid credentials');

            setUser(foundUser);
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            return foundUser;
        } catch (error) {
            reportError(error);
            throw error;
        }
    };

    const logout = () => {
        try {
            setUser(null);
            localStorage.removeItem('currentUser');
        } catch (error) {
            reportError(error);
        }
    };

    const hasPermission = (permission) => {
        try {
            if (!user) return false;
            if (user.role === 'admin' || user.permissions.includes('all')) return true;
            return user.permissions.includes(permission);
        } catch (error) {
            reportError(error);
            return false;
        }
    };

    const hasViewPermission = (module) => {
        return hasPermission(`${module}.view`);
    };

    const hasEditPermission = (module) => {
        return hasPermission(`${module}.edit`);
    };

    React.useEffect(() => {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [
                {
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    role: 'admin',
                    permissions: ['all']
                },
                {
                    id: 2,
                    username: 'waiter',
                    password: 'waiter123',
                    role: 'waiter',
                    permissions: ['dashboard.view', 'tables.view', 'tables.edit', 'orders.view', 'orders.edit', 'menu.view']
                },
                {
                    id: 3,
                    username: 'receptionist',
                    password: 'reception123',
                    role: 'receptionist',
                    permissions: ['dashboard.view', 'rooms.view', 'rooms.edit', 'tables.view']
                }
            ];
            localStorage.setItem('users', JSON.stringify(users));

            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        } catch (error) {
            reportError(error);
            setLoading(false);
        }
    }, []);

    return React.createElement(AuthContext.Provider, {
        value: { 
            user, 
            login, 
            logout,
            hasPermission,
            hasViewPermission,
            hasEditPermission,
            loading
        }
    }, children);
}

const AuthContext = React.createContext(null);

function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
