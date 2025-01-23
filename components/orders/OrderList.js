function OrderList({ orders, onViewDetails }) {
    const columns = [
        { key: 'id', label: 'Order ID' },
        { key: 'tableInfo', label: 'Table' },
        { key: 'roomInfo', label: 'Room' },
        { key: 'total', label: 'Total' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Created At' }
    ];

    const formattedOrders = orders.map(order => ({
        ...order,
        tableInfo: order.tableId ? `Table ${order.tableId}` : '-',
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
