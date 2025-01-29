function AuthProvider({ children }) {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const login = async (username, password) => {
        try {
            const usersSnapshot = await db.collection('users')
                .where('username', '==', username)
                .where('password', '==', password)
                .get();

            if (usersSnapshot.empty) {
                throw new Error('Invalid credentials');
            }

            const userData = {
                id: usersSnapshot.docs[0].id,
                ...usersSnapshot.docs[0].data()
            };

            setUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            return userData;
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
