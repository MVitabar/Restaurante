function App() {
    return React.createElement(AuthProvider, null,
        React.createElement(TranslationProvider, null,
            React.createElement(Router, null)
        )
    );
}

function Router() {
    const [currentPage, setCurrentPage] = React.useState('dashboard');
    const { user, loading } = useAuth();
    const { t } = useTranslation();

    if (loading) {
        return React.createElement('div', {
            className: 'flex items-center justify-center h-screen'
        }, t('loading'));
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
