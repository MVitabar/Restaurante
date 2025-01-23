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

    const createUser = async (userData) => {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const newUser = {
                id: users.length + 1,
                ...userData
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

    const checkPermission = (permission) => {
        try {
            if (!user) return false;
            if (user.role === 'admin') return true;
            return user.permissions.includes(permission);
        } catch (error) {
            reportError(error);
            return false;
        }
    };

    React.useEffect(() => {
        try {
            // Initialize default admin user if no users exist
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.length === 0) {
                localStorage.setItem('users', JSON.stringify([{
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    role: 'admin',
                    permissions: ['all']
                }]));
            }

            // Check for stored session
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
            checkPermission, 
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
