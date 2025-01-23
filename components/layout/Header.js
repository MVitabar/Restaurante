function Header({ title, user, onMenuClick }) {
    const { logout } = useAuth();

    return React.createElement('header', {
        className: 'header shadow-lg',
        'data-name': 'header'
    },
        React.createElement('div', {
            className: 'flex items-center gap-4'
        },
            React.createElement('button', {
                className: 'lg:hidden text-2xl',
                onClick: onMenuClick,
                'data-name': 'menu-button'
            },
                React.createElement('i', {
                    className: 'fas fa-bars'
                })
            ),
            React.createElement('h1', {
                className: 'text-2xl font-bold text-glow',
                'data-name': 'header-title'
            }, title)
        ),
        React.createElement('div', {
            className: 'flex items-center gap-4',
            'data-name': 'header-actions'
        },
            React.createElement('span', {
                className: 'text-sm opacity-75',
                'data-name': 'user-name'
            }, user?.username),
            React.createElement(Button, {
                onClick: logout,
                variant: 'outline',
                className: 'text-sm',
                'data-name': 'logout-button'
            }, 'Logout')
        )
    );
}
