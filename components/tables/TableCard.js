function TableCard({ table, onStatusChange, currentOrder, onViewOrder }) {
    const statusColors = {
        available: 'bg-green-500',
        occupied: 'bg-red-500',
        reserved: 'bg-yellow-500'
    };

    return React.createElement('div', {
        className: 'card',
        'data-name': 'table-card'
    },
        React.createElement('div', {
            className: 'flex justify-between items-start mb-4'
        },
            React.createElement('div', null,
                React.createElement('h3', {
                    className: 'text-xl font-semibold mb-1',
                    'data-name': 'table-number'
                }, `Table ${table.id}`),
                React.createElement('span', {
                    className: 'text-sm opacity-75',
                    'data-name': 'table-seats'
                }, `${table.seats} seats`)
            ),
            React.createElement('div', {
                className: `w-3 h-3 rounded-full ${statusColors[table.status]}`,
                'data-name': 'table-status-indicator'
            })
        ),
        React.createElement('div', {
            className: 'space-y-2'
        },
            React.createElement('div', {
                className: 'flex justify-between'
            },
                React.createElement('span', null, 'Status:'),
                React.createElement('span', {
                    className: 'font-semibold',
                    'data-name': 'table-status'
                }, table.status)
            ),
            currentOrder && React.createElement('div', {
                className: 'mt-4 p-3 bg-white/5 rounded'
            },
                React.createElement('div', {
                    className: 'flex justify-between mb-2'
                },
                    React.createElement('span', {
                        className: 'font-semibold'
                    }, 'Current Order:'),
                    React.createElement('span', null, `$${currentOrder.total.toFixed(2)}`)
                ),
                React.createElement('div', {
                    className: 'text-sm opacity-75'
                },
                    `${currentOrder.items.length} items`
                ),
                React.createElement(Button, {
                    onClick: () => onViewOrder(currentOrder),
                    variant: 'secondary',
                    className: 'w-full mt-2',
                    'data-name': 'view-order-button'
                }, 'View Order')
            )
        ),
        !currentOrder && React.createElement('div', {
            className: 'mt-4'
        },
            React.createElement(Button, {
                onClick: () => onStatusChange(table.id),
                className: 'w-full',
                'data-name': 'change-status-button'
            }, 'Change Status')
        )
    );
}
