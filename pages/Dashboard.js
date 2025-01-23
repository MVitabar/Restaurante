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

                // Calculate today's revenue
                const today = new Date().toISOString().split('T')[0];
                const todayOrders = orders.filter(order => 
                    order.createdAt.startsWith(today)
                );
                const dailyRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

                // Calculate weekly revenue
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

                // Save stats to local storage
                localStorage.setItem('dashboardStats', JSON.stringify({
                    timestamp: new Date().toISOString(),
                    stats: {
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
                    }
                }));
            };

            // Try to load from local storage first
            const storedStats = localStorage.getItem('dashboardStats');
            if (storedStats) {
                const { timestamp, stats: savedStats } = JSON.parse(storedStats);
                const lastUpdate = new Date(timestamp);
                const now = new Date();
                // If stats are less than 5 minutes old, use them
                if (now.getTime() - lastUpdate.getTime() < 5 * 60 * 1000) {
                    setStats(savedStats);
                    return;
                }
            }

            fetchStats();
        } catch (error) {
            reportError(error);
        }
    }, []);

    const StatCard = ({ title, value, subValue, icon }) => {
        return React.createElement('div', {
            className: 'card',
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
        className: 'space-y-6',
        'data-name': 'dashboard'
    },
        React.createElement('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
        },
            React.createElement(StatCard, {
                title: 'Tables',
                value: `${stats.tables.occupied}/${stats.tables.total}`,
                subValue: 'Currently Occupied',
                icon: 'fas fa-chair'
            }),
            React.createElement(StatCard, {
                title: 'Rooms',
                value: `${stats.rooms.occupied}/${stats.rooms.total}`,
                subValue: 'Currently Occupied',
                icon: 'fas fa-bed'
            }),
            React.createElement(StatCard, {
                title: 'Orders',
                value: stats.orders.pending,
                subValue: 'Pending Orders',
                icon: 'fas fa-receipt'
            }),
            React.createElement(StatCard, {
                title: 'Today\'s Revenue',
                value: `$${stats.revenue.daily.toFixed(2)}`,
                subValue: `$${stats.revenue.weekly.toFixed(2)} This Week`,
                icon: 'fas fa-dollar-sign'
            })
        )
    );
}
