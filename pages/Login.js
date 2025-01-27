function LoginPage() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const { login } = useAuth();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
        } catch (error) {
            reportError(error);
            setError(t('invalidCredentials'));
        } finally {
            setLoading(false);
        }
    };

    return React.createElement('div', {
        className: 'min-h-screen flex items-center justify-center p-4',
        'data-name': 'login-page'
    },
        React.createElement('div', {
            className: 'card max-w-md w-full p-8 space-y-6'
        },
            React.createElement('div', {
                className: 'text-center mb-8'
            },
                React.createElement('h1', {
                    className: 'text-3xl font-bold text-glow mb-2',
                    'data-name': 'login-title'
                }, t('hotelAndRestaurant')),
                React.createElement('p', {
                    className: 'text-white/60',
                    'data-name': 'login-subtitle'
                }, t('login'))
            ),
            React.createElement('form', {
                onSubmit: handleSubmit,
                className: 'space-y-4',
                'data-name': 'login-form'
            },
                React.createElement('div', null,
                    React.createElement('label', {
                        className: 'block text-sm font-medium mb-2'
                    }, t('username')),
                    React.createElement('input', {
                        type: 'text',
                        value: username,
                        onChange: (e) => setUsername(e.target.value),
                        className: 'input w-full',
                        required: true,
                        'data-name': 'username-input'
                    })
                ),
                React.createElement('div', null,
                    React.createElement('label', {
                        className: 'block text-sm font-medium mb-2'
                    }, t('password')),
                    React.createElement('input', {
                        type: 'password',
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                        className: 'input w-full',
                        required: true,
                        'data-name': 'password-input'
                    })
                ),
                error && React.createElement('div', {
                    className: 'text-red-500 text-sm',
                    'data-name': 'login-error'
                }, error),
                React.createElement('div', {
                    className: 'flex items-center justify-between'
                },
                    React.createElement('label', {
                        className: 'flex items-center',
                        'data-name': 'remember-me'
                    },
                        React.createElement('input', {
                            type: 'checkbox',
                            className: 'mr-2'
                        }),
                        React.createElement('span', {
                            className: 'text-sm'
                        }, t('rememberMe'))
                    ),
                    React.createElement('a', {
                        href: '#',
                        className: 'text-sm text-purple-300 hover:text-purple-200',
                        'data-name': 'forgot-password'
                    }, t('forgotPassword'))
                ),
                React.createElement(Button, {
                    type: 'submit',
                    className: 'w-full',
                    disabled: loading,
                    'data-name': 'login-button'
                }, loading ? t('loading') : t('login'))
            )
        )
    );
}
