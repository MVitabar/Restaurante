function Tables() {
    const [tables, setTables] = React.useState([]);
    const [orders, setOrders] = React.useState([]);
    const [selectedTable, setSelectedTable] = React.useState(null);
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false);
    const [isCompletionModalOpen, setIsCompletionModalOpen] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        try {
            const fetchData = async () => {
                const [tablesData, ordersData] = await Promise.all([
                    query('tables'),
                    query('orders')
                ]);
                setTables(tablesData);
                setOrders(ordersData);
            };
            fetchData();
        } catch (error) {
            reportError(error);
        }
    }, []);

    const getTableOrder = (tableId) => {
        return orders.find(order => 
            order.tableId === tableId && order.status === 'pending'
        );
    };

    const handleStatusChange = async (tableId) => {
        try {
            const table = tables.find(t => t.id === tableId);
            const currentOrder = getTableOrder(tableId);
            
            if (currentOrder) {
                return; // Prevent status change if table has an active order
            }
            
            setSelectedTable(table);
            setIsModalOpen(true);
        } catch (error) {
            reportError(error);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            await update('tables', selectedTable.id, { status: newStatus });
            setTables(tables.map(table =>
                table.id === selectedTable.id
                    ? { ...table, status: newStatus }
                    : table
            ));
            setIsModalOpen(false);
        } catch (error) {
            reportError(error);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
        setIsEditing(false);
    };

    const handleUpdateOrder = async (orderData) => {
        try {
            const updatedOrder = await update('orders', selectedOrder.id, orderData);
            setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
            setSelectedOrder(updatedOrder);
            setIsEditing(false);
        } catch (error) {
            reportError(error);
        }
    };

    const handleCompleteOrder = async () => {
        try {
            if (selectedOrder.tableId) {
                await update('tables', selectedOrder.tableId, { status: 'available' });
                setTables(tables.map(table =>
                    table.id === selectedOrder.tableId
                        ? { ...table, status: 'available' }
                        : table
                ));
            }
            
            await update('orders', selectedOrder.id, { status: 'completed' });
            setOrders(orders.map(o => 
                o.id === selectedOrder.id ? { ...o, status: 'completed' } : o
            ));
            
            setIsCompletionModalOpen(false);
            setIsOrderModalOpen(false);
            setSelectedOrder(null);
        } catch (error) {
            reportError(error);
        }
    };

    return React.createElement('div', {
        className: 'space-y-6',
        'data-name': 'tables-page'
    },
        React.createElement('div', {
            className: 'flex justify-between items-center'
        },
            React.createElement('h2', {
                className: 'text-2xl font-bold'
            }, 'Restaurant Tables'),
            React.createElement(Button, {
                onClick: () => setIsModalOpen(true),
                'data-name': 'add-table-button'
            }, 'Add Table')
        ),
        React.createElement(TableGrid, {
            tables,
            orders,
            onStatusChange: handleStatusChange,
            onViewOrder: handleViewOrder
        }),
        React.createElement(Modal, {
            isOpen: isModalOpen,
            onClose: () => setIsModalOpen(false),
            title: 'Update Table Status'
        },
            React.createElement('div', {
                className: 'space-y-4'
            },
                ['available', 'occupied', 'reserved'].map(status =>
                    React.createElement(Button, {
                        key: status,
                        onClick: () => handleUpdateStatus(status),
                        className: `w-full mb-2 text-white ${selectedTable?.status === status ? 'bg-purple-600' : 'bg-purple-500 hover:bg-purple-600'}`,
                        variant: selectedTable?.status === status ? 'primary' : 'outline',
                        'data-name': `status-button-${status}`
                    }, status.charAt(0).toUpperCase() + status.slice(1))
                )
            )
        ),
        React.createElement(Modal, {
            isOpen: isOrderModalOpen,
            onClose: () => {
                setIsOrderModalOpen(false);
                setSelectedOrder(null);
                setIsEditing(false);
            },
            title: isEditing ? 'Edit Order' : 'Order Details',
            size: 'lg'
        },
            selectedOrder && (isEditing ?
                React.createElement(OrderForm, {
                    initialData: selectedOrder,
                    onSubmit: handleUpdateOrder
                })
                :
                React.createElement('div', {
                    className: 'space-y-4'
                },
                    React.createElement('div', {
                        className: 'flex justify-end gap-2 mb-4'
                    },
                        React.createElement(Button, {
                            onClick: () => setIsEditing(true),
                            variant: 'secondary',
                            'data-name': 'edit-order-button'
                        }, 'Edit Order'),
                        selectedOrder.status === 'pending' && React.createElement(Button, {
                            onClick: () => setIsCompletionModalOpen(true),
                            'data-name': 'complete-order-button'
                        }, 'Complete Order')
                    ),
                    React.createElement('div', {
                        className: 'grid grid-cols-2 gap-4'
                    },
                        React.createElement('div', null,
                            React.createElement('p', {
                                className: 'font-semibold'
                            }, 'Order ID:'),
                            React.createElement('p', null, selectedOrder.id)
                        ),
                        React.createElement('div', null,
                            React.createElement('p', {
                                className: 'font-semibold'
                            }, 'Status:'),
                            React.createElement('p', null, selectedOrder.status)
                        )
                    ),
                    React.createElement('div', {
                        className: 'mt-4'
                    },
                        React.createElement('h3', {
                            className: 'font-semibold mb-2'
                        }, 'Items:'),
                        React.createElement('div', {
                            className: 'space-y-2'
                        },
                            selectedOrder.items.map((item, index) =>
                                React.createElement('div', {
                                    key: index,
                                    className: 'flex justify-between'
                                },
                                    React.createElement('span', null, `${item.quantity}x ${item.name}`),
                                    React.createElement('span', null, `$${(item.price * item.quantity).toFixed(2)}`)
                                )
                            )
                        )
                    ),
                    React.createElement('div', {
                        className: 'flex justify-between items-center text-xl font-semibold mt-4 pt-4 border-t border-white/10'
                    },
                        'Total:',
                        `$${selectedOrder.total.toFixed(2)}`
                    )
                )
            )
        ),
        React.createElement(Modal, {
            isOpen: isCompletionModalOpen,
            onClose: () => setIsCompletionModalOpen(false),
            title: 'Complete Order',
            size: 'md'
        },
            selectedOrder && React.createElement('div', {
                className: 'space-y-4'
            },
                React.createElement('p', {
                    className: 'text-lg'
                }, 'Please confirm the order details:'),
                React.createElement('div', {
                    className: 'bg-white/5 p-4 rounded'
                },
                    React.createElement('div', {
                        className: 'space-y-2 mb-4'
                    },
                        selectedOrder.items.map((item, index) =>
                            React.createElement('div', {
                                key: index,
                                className: 'flex justify-between'
                            },
                                React.createElement('span', null, `${item.quantity}x ${item.name}`),
                                React.createElement('span', null, `$${(item.price * item.quantity).toFixed(2)}`)
                            )
                        )
                    ),
                    React.createElement('div', {
                        className: 'flex justify-between items-center text-xl font-semibold pt-4 border-t border-white/10'
                    },
                        'Total:',
                        `$${selectedOrder.total.toFixed(2)}`
                    )
                ),
                React.createElement('div', {
                    className: 'flex gap-4'
                },
                    React.createElement(Button, {
                        onClick: handleCompleteOrder,
                        className: 'flex-1',
                        'data-name': 'confirm-completion-button'
                    }, 'Confirm & Complete'),
                    React.createElement(Button, {
                        onClick: () => setIsCompletionModalOpen(false),
                        variant: 'outline',
                        className: 'flex-1',
                        'data-name': 'cancel-completion-button'
                    }, 'Cancel')
                )
            )
        )
    );
}
