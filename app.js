function App() {
    return React.createElement(AuthProvider, null,
        React.createElement(Router, null)
    );
}

function Router() {
    const [currentPage, setCurrentPage] = React.useState('dashboard');
    const { user, loading } = useAuth();

    if (loading) {
        return React.createElement('div', {
            className: 'flex items-center justify-center h-screen'
        }, 'Loading...');
    }

    if (!user) {
        return React.createElement(LoginPage, null);
    }

    const pages = {
        dashboard: Dashboard,
        tables: Tables,
        rooms: Rooms,
        orders: Orders,
        menu: Menu,
        reports: Reports,
        settings: Settings
    };

    const CurrentPage = pages[currentPage];

    return React.createElement(MainLayout, {
        currentPage,
        onPageChange: setCurrentPage
    }, React.createElement(CurrentPage, null));
}

function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
        } catch (error) {
            reportError(error);
            setError('Invalid credentials');
        }
    };

    return React.createElement('div', {
        className: 'flex items-center justify-center h-screen'
    },
        React.createElement('form', {
            onSubmit: handleSubmit,
            className: 'glassmorphism p-8 w-96'
        },
            React.createElement('h1', {
                className: 'text-2xl font-bold mb-6 text-center text-glow'
            }, 'Login'),
            React.createElement('input', {
                type: 'text',
                value: username,
                onChange: (e) => setUsername(e.target.value),
                placeholder: 'Username',
                className: 'input w-full mb-4',
                'data-name': 'username-input'
            }),
            React.createElement('input', {
                type: 'password',
                value: password,
                onChange: (e) => setPassword(e.target.value),
                placeholder: 'Password',
                className: 'input w-full mb-4',
                'data-name': 'password-input'
            }),
            error && React.createElement('div', {
                className: 'text-red-500 mb-4'
            }, error),
            React.createElement('button', {
                type: 'submit',
                className: 'btn btn-primary w-full',
                'data-name': 'login-button'
            }, 'Login')
        )
    );
}

// Initialize the app
initializeDatabase().then(() => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
});
