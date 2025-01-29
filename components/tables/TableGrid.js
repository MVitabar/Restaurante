function TableGrid({ tables, onStatusChange, orders, onViewOrder, onTableClick }) {
    const getTableOrder = (tableId) => {
        return orders.find(order => 
            order.tableId === tableId && order.status === 'pending'
        );
    };

    // Sort tables by number
    const sortedTables = [...tables].sort((a, b) => a.number - b.number);

    return React.createElement('div', {
        className: 'grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4',
        'data-name': 'table-grid'
    },
        sortedTables.map(table =>
            React.createElement(TableCard, {
                key: table.id,
                table,
                onStatusChange,
                currentOrder: getTableOrder(table.id),
                onViewOrder,
                onClick: onTableClick
            })
        )
    );
}
