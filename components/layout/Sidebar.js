function Sidebar({ currentPage, onPageChange }) {
    const { t } = useTranslation();
    const { checkPermission, user } = useAuth();

    const menuItems = [
        { 
            id: 'dashboard', 
            label: t('dashboard'), 
            icon: 'fas fa-home',
            permission: 'dashboard.view' 
        },
        { 
            id: 'tables', 
            label: t('tables'), 
            icon: 'fas fa-chair',
            permission: 'tables.view'
        },
        { 
            id: 'rooms', 
            label: t('rooms'), 
            icon: 'fas fa-bed',
            permission: 'rooms.view'
        },
        { 
            id: 'orders', 
            label: t('orders'), 
            icon: 'fas fa-receipt',
            permission: 'orders.view'
        },
        { 
            id: 'menu', 
            label: t('menu'), 
            icon: 'fas fa-utensils',
            permission: 'menu.view'
        },
        { 
            id: 'reports', 
            label: t('reports'), 
            icon: 'fas fa-chart-bar',
            permission: 'reports.view'
        },
        { 
            id: 'settings', 
            label: t('settings'), 
            icon: 'fas fa-cog',
            permission: 'settings.view'
        }
    ];

    const filteredMenuItems = menuItems.filter(item => {
        if (user.role === 'admin') return true;
        return user.permissions.includes(item.permission);
    });

    return React.createElement('div', {
        className: 'h-full flex flex-col',
        'data-name': 'sidebar'
    },
        React.createElement('div', {
            className: 'mb-8 p-4',
            'data-name': 'logo'
        },
            React.createElement('h1', {
                className: 'text-xl font-bold text-glow'
            }, t('hotelAndRestaurant'))
        ),
        React.createElement('nav', {
            className: 'flex-1 overflow-y-auto hide-scrollbar px-2',
            'data-name': 'navigation'
        },
            filteredMenuItems.map(item =>
                React.createElement('button', {
                    key: item.id,
                    onClick: () => onPageChange(item.id),
                    className: `w-full text-left p-3 mb-2 rounded flex items-center gap-3
                        ${currentPage === item.id ? 'gradient-primary' : 'hover:bg-white/10'}
                        transition-colors duration-200`,
                    'data-name': `nav-item-${item.id}`
                },
                    React.createElement('i', { 
                        className: `${item.icon} w-5 text-center`
                    }),
                    React.createElement('span', {
                        className: 'flex-1 truncate'
                    }, item.label)
                )
            )
        )
    );
}
