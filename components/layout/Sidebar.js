function Sidebar({ currentPage, onPageChange }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
        { id: 'tables', label: 'Tables', icon: 'fas fa-chair' },
        { id: 'rooms', label: 'Rooms', icon: 'fas fa-bed' },
        { id: 'orders', label: 'Orders', icon: 'fas fa-receipt' },
        { id: 'menu', label: 'Menu', icon: 'fas fa-utensils' },
        { id: 'reports', label: 'Reports', icon: 'fas fa-chart-bar' },
        { id: 'settings', label: 'Settings', icon: 'fas fa-cog' }
    ];

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
            }, 'Hotel & Restaurant')
        ),
        React.createElement('nav', {
            className: 'flex-1 overflow-y-auto hide-scrollbar px-2',
            'data-name': 'navigation'
        },
            menuItems.map(item =>
                React.createElement('button', {
                    key: item.id,
                    onClick: () => onPageChange(item.id),
                    className: `w-full text-left p-3 mb-2 rounded flex items-center gap-3
                        ${currentPage === item.id ? 'gradient-primary' : 'hover:bg-white/10'}`,
                    'data-name': `nav-item-${item.id}`
                },
                    React.createElement('i', { className: item.icon }),
                    item.label
                )
            )
        )
    );
}
