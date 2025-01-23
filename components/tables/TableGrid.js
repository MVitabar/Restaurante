function TableGrid({ tables, onStatusChange, orders, onViewOrder }) {
    const getTableOrder = (tableId) => {
        return orders.find(order => 
            order.tableId === tableId && order.status === 'pending'
        );
    };

    return React.createElement('div', {
        className: 'grid-container',
        'data-name': 'table-grid'
    },
        tables.map(table =>
            React.createElement(TableCard, {
                key: table.id,
                table,
                onStatusChange,
                currentOrder: getTableOrder(table.id),
                onViewOrder
            })
        )
    );
}
