function OrderList({ orders, onViewDetails }) {
    const columns = [
        { key: 'id', label: 'Order ID' },
        { key: 'createdBy', label: 'Created By' },
        { key: 'tableInfo', label: 'Table' },
        { key: 'roomInfo', label: 'Room' },
        { key: 'total', label: 'Total' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Created At' }
    ];

    const formattedOrders = orders.map(order => ({
        ...order,
        createdBy: order.createdBy?.username || 'Unknown',
        tableInfo: order.tableId ? `Mesa ${order.tableId}` : '-',
        roomInfo: order.roomId ? `Room ${order.roomId}` : '-',
        total: `$${order.total.toFixed(2)}`,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        createdAt: new Date(order.createdAt).toLocaleString()
    }));

    return React.createElement('div', {
        className: 'space-y-4',
        'data-name': 'order-list'
    },
        React.createElement(Table, {
            columns,
            data: formattedOrders,
            onRowClick: onViewDetails
        })
    );
}
