function TableCard({ table, onStatusChange, currentOrder, onViewOrder, onClick }) {
    const statusColors = {
        available: 'bg-green-500',
        occupied: 'bg-red-500',
        reserved: 'bg-yellow-500'
    };

    return React.createElement('div', {
        className: 'card cursor-pointer hover:bg-white/5 transition-colors',
        onClick: () => onClick(table),
        'data-name': 'table-card'
    },
        React.createElement('div', {
            className: 'flex justify-between items-start'
        },
            React.createElement('div', {
                className: 'flex items-center gap-2'
            },
                React.createElement('span', {
                    className: 'text-xl font-semibold',
                    'data-name': 'table-number'
                }, `Mesa ${table.id}`),
                React.createElement('div', {
                    className: `w-3 h-3 rounded-full ${statusColors[table.status]}`,
                    'data-name': 'table-status-indicator'
                })
            ),
            React.createElement('span', {
                className: 'text-sm opacity-75',
                'data-name': 'table-seats'
            }, `${table.seats} lugares`)
        ),
        currentOrder && React.createElement('div', {
            className: 'mt-2 text-sm opacity-75'
        },
            React.createElement('i', {
                className: 'fas fa-receipt mr-2'
            }),
            `Pedido: $${currentOrder.total.toFixed(2)}`
        )
    );
}
