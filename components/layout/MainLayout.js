function MainLayout({ children, currentPage, onPageChange }) {
    const { user, hasViewPermission } = useAuth();

    // Redirect to dashboard if user doesn't have permission for current page
    React.useEffect(() => {
        if (!hasViewPermission(currentPage)) {
            onPageChange('dashboard');
        }
    }, [currentPage]);

    return React.createElement('div', {
        className: 'layout-container',
        'data-name': 'main-layout'
    },
        React.createElement(Sidebar, {
            currentPage,
            onPageChange
        }),
        React.createElement('main', {
            className: 'main-content',
            'data-name': 'main-content'
        },
            React.createElement(Header, {
                title: currentPage.charAt(0).toUpperCase() + currentPage.slice(1),
                user
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
