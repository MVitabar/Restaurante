function MainLayout({ children, currentPage, onPageChange }) {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return React.createElement('div', {
        className: 'layout-container',
        'data-name': 'main-layout'
    },
        React.createElement('div', {
            className: `sidebar-overlay lg:hidden ${isSidebarOpen ? 'active' : ''}`,
            onClick: () => setIsSidebarOpen(false),
            'data-name': 'sidebar-overlay'
        }),
        React.createElement('div', {
            className: `sidebar-wrapper ${isSidebarOpen ? 'active' : ''}`,
            'data-name': 'sidebar-wrapper'
        },
            React.createElement(Sidebar, {
                currentPage,
                onPageChange: (page) => {
                    onPageChange(page);
                    setIsSidebarOpen(false);
                }
            })
        ),
        React.createElement('main', {
            className: 'main-content',
            'data-name': 'main-content'
        },
            React.createElement(Header, {
                title: currentPage.charAt(0).toUpperCase() + currentPage.slice(1),
                user,
                onMenuClick: () => setIsSidebarOpen(!isSidebarOpen)
            }),
            React.createElement('div', {
                className: 'p-6',
                'data-name': 'page-content'
            }, children)
        )
    );
}
