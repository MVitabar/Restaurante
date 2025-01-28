function MainLayout({ children, currentPage, onPageChange }) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const { user, hasViewPermission } = useAuth();

    // Redirect to dashboard if user doesn't have permission for current page
    React.useEffect(() => {
        if (!hasViewPermission(currentPage)) {
            onPageChange('dashboard');
        }
    }, [currentPage]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return React.createElement('div', {
        className: 'layout-container',
        'data-name': 'main-layout'
    },
        React.createElement('div', {
            className: `sidebar-overlay ${isSidebarOpen ? 'active' : ''}`,
            onClick: closeSidebar,
            'data-name': 'sidebar-overlay'
        }),
        React.createElement('div', {
            className: `sidebar-wrapper ${isSidebarOpen ? 'active' : ''}`,
            'data-name': 'sidebar'
        },
            React.createElement(Sidebar, {
                currentPage,
                onPageChange: (page) => {
                    onPageChange(page);
                    closeSidebar();
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
                onMenuClick: toggleSidebar
            }),
            React.createElement('div', {
                className: 'p-6',
                'data-name': 'page-content'
            }, 
                hasViewPermission(currentPage) ? children : 
                React.createElement('div', {
                    className: 'text-center text-red-500'
                }, 'Access Denied')
            )
        )
    );
}
