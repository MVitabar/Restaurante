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

    const createUser = async (userData) => {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const newUser = {
                id: users.length + 1,
                ...userData,
                permissions: userData.permissions || []
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            return newUser;
        } catch (error) {
            reportError(error);
            throw error;
        }
    };

    const updateUser = async (userId, userData) => {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const updatedUsers = users.map(user => 
                user.id === userId ? { ...user, ...userData } : user
            );
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            if (user && user.id === userId) {
                const updatedUser = updatedUsers.find(u => u.id === userId);
                setUser(updatedUser);
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            }
            
            return updatedUsers.find(u => u.id === userId);
        } catch (error) {
            reportError(error);
            throw error;
        }
    };

    const deleteUser = async (userId) => {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const filteredUsers = users.filter(user => user.id !== userId);
            localStorage.setItem('users', JSON.stringify(filteredUsers));
        } catch (error) {
            reportError(error);
            throw error;
        }
    };

    const listUsers = async () => {
        try {
            return JSON.parse(localStorage.getItem('users')) || [];
        } catch (error) {
            reportError(error);
            throw error;
        }
    };

    React.useEffect(() => {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.length === 0) {
                const defaultAdmin = {
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    role: 'admin',
                    permissions: ['all']
                };
                localStorage.setItem('users', JSON.stringify([defaultAdmin]));
            }

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
            loading,
            createUser,
            updateUser,
            deleteUser,
            listUsers
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
