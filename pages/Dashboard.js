function Dashboard() {
    const [stats, setStats] = React.useState({
        tables: { total: 0, occupied: 0 },
        rooms: { total: 0, occupied: 0 },
        orders: { total: 0, pending: 0 },
        revenue: { daily: 0, weekly: 0 }
    });

    React.useEffect(() => {
        try {
            const fetchStats = async () => {
                const [tables, rooms, orders] = await Promise.all([
                    query('tables'),
                    query('rooms'),
                    query('orders')
                ]);

                const today = new Date().toISOString().split('T')[0];
                const todayOrders = orders.filter(order => 
                    order.createdAt.startsWith(today)
                );
                const dailyRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                const weeklyOrders = orders.filter(order => 
                    new Date(order.createdAt) >= weekAgo
                );
                const weeklyRevenue = weeklyOrders.reduce((sum, order) => sum + order.total, 0);

                setStats({
                    tables: {
                        total: tables.length,
                        occupied: tables.filter(t => t.status === 'occupied').length
                    },
                    rooms: {
                        total: rooms.length,
                        occupied: rooms.filter(r => r.status === 'occupied').length
                    },
                    orders: {
                        total: orders.length,
                        pending: orders.filter(o => o.status === 'pending').length
                    },
                    revenue: {
                        daily: dailyRevenue,
                        weekly: weeklyRevenue
                    }
                });
            };

            fetchStats();
            // Set up interval for real-time updates
            const interval = setInterval(fetchStats, 5000);
            return () => clearInterval(interval);
        } catch (error) {
            reportError(error);
        }
    }, []);

    const StatCard = ({ title, value, subValue, icon, section }) => {
        return React.createElement('div', {
            className: 'card cursor-pointer hover:bg-white/10 transition-colors',
            onClick: () => {
                // Navigate to section
                const mainContent = document.querySelector('.main-content');
                const sectionElement = document.querySelector(`[data-name="${section}-page"]`);
                if (mainContent && sectionElement) {
                    mainContent.scrollTo({
                        top: sectionElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
                // Update URL hash
                window.location.hash = `#${section}`;
            },
            'data-name': `stat-card-${title.toLowerCase()}`
        },
            React.createElement('div', {
                className: 'flex justify-between items-start'
            },
                React.createElement('div', null,
                    React.createElement('h3', {
                        className: 'text-lg opacity-75'
                    }, title),
                    React.createElement('p', {
                        className: 'text-3xl font-bold mt-2'
                    }, value),
                    subValue && React.createElement('p', {
                        className: 'text-sm opacity-75 mt-1'
                    }, subValue)
                ),
                React.createElement('i', {
                    className: `${icon} text-2xl opacity-50`
                })
            )
        );
    };

    return React.createElement('div', {
        className: 'space-y-6 p-4',
        'data-name': 'dashboard-page'
    },
        React.createElement('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
        },
            React.createElement(StatCard, {
                title: 'Tables',
                value: `${stats.tables.occupied}/${stats.tables.total}`,
                subValue: 'Currently Occupied',
                icon: 'fas fa-chair',
                section: 'tables'
            }),
            React.createElement(StatCard, {
                title: 'Rooms',
                value: `${stats.rooms.occupied}/${stats.rooms.total}`,
                subValue: 'Currently Occupied',
                icon: 'fas fa-bed',
                section: 'rooms'
            }),
            React.createElement(StatCard, {
                title: 'Orders',
                value: stats.orders.pending,
                subValue: 'Pending Orders',
                icon: 'fas fa-receipt',
                section: 'orders'
            }),
            React.createElement(StatCard, {
                title: 'Today\'s Revenue',
                value: `$${stats.revenue.daily.toFixed(2)}`,
                subValue: `$${stats.revenue.weekly.toFixed(2)} This Week`,
                icon: 'fas fa-dollar-sign',
                section: 'reports'
            })
        )
    );
}
