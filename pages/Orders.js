function Orders() {
    const [orders, setOrders] = React.useState([]);
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isNewOrderModalOpen, setIsNewOrderModalOpen] = React.useState(false);
    const [orderDetails, setOrderDetails] = React.useState(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const { user } = useAuth();

    React.useEffect(() => {
        try {
            const fetchOrders = async () => {
                const data = await query('orders');
                setOrders(data);
            };
            fetchOrders();
        } catch (error) {
            reportError(error);
        }
    }, []);

    const handleCreateOrder = async (orderData) => {
        try {
            const newOrder = await insert('orders', {
                ...orderData,
                createdBy: {
                    id: user.id,
                    username: user.username
                }
            });
            setOrders([...orders, newOrder]);
            setIsNewOrderModalOpen(false);
        } catch (error) {
            reportError(error);
        }
    };

    const handleUpdateOrder = async (orderData) => {
        try {
            const updatedOrder = await update('orders', orderDetails.id, orderData);
            setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
            setOrderDetails(updatedOrder);
            setIsEditing(false);
        } catch (error) {
            reportError(error);
        }
    };

    const handleViewDetails = async (order) => {
        try {
            setSelectedOrder(order);
            const [table, room] = await Promise.all([
                order.tableId ? query('tables', { id: order.tableId }) : null,
                order.roomId ? query('rooms', { id: order.roomId }) : null
            ]);

            setOrderDetails({
                ...order,
                table: table ? table[0] : null,
                room: room ? room[0] : null
            });
            setIsModalOpen(true);
            setIsEditing(false);
        } catch (error) {
            reportError(error);
        }
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            const order = orders.find(o => o.id === orderId);
            if (order.tableId) {
                await update('tables', order.tableId, { status: 'available' });
            }
            await update('orders', orderId, { status: 'completed' });
            setOrders(orders.map(o => 
                o.id === orderId ? { ...o, status: 'completed' } : o
            ));
            setIsModalOpen(false);
        } catch (error) {
            reportError(error);
        }
    };

    return React.createElement('div', {
        className: 'space-y-6',
        'data-name': 'orders-page'
    },
        React.createElement('div', {
            className: 'flex justify-between items-center'
        },
            React.createElement('h2', {
                className: 'text-2xl font-bold'
            }, 'Orders'),
            React.createElement(Button, {
                onClick: () => setIsNewOrderModalOpen(true),
                'data-name': 'new-order-button'
            }, 'New Order')
        ),
        React.createElement(OrderList, {
            orders,
            onViewDetails: handleViewDetails
        }),
        React.createElement(Modal, {
            isOpen: isModalOpen,
            onClose: () => {
                setIsModalOpen(false);
                setOrderDetails(null);
                setIsEditing(false);
            },
            title: isEditing ? 'Edit Order' : 'Order Details',
            size: 'lg'
        },
            orderDetails && (isEditing ? 
                React.createElement(OrderForm, {
                    initialData: orderDetails,
                    onSubmit: handleUpdateOrder
                })
                :
                React.createElement('div', {
                    className: 'space-y-4'
                },
                    React.createElement('div', {
                        className: 'flex justify-end mb-4'
                    },
                        React.createElement(Button, {
                            onClick: () => setIsEditing(true),
                            variant: 'secondary',
                            className: 'mr-2',
                            'data-name': 'edit-order-button'
                        }, 'Edit Order'),
                        orderDetails.status === 'pending' && React.createElement(Button, {
                            onClick: () => handleCompleteOrder(orderDetails.id),
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
                            React.createElement('p', null, orderDetails.id)
                        ),
                        React.createElement('div', null,
                            React.createElement('p', {
                                className: 'font-semibold'
                            }, 'Created By:'),
                            React.createElement('p', null, orderDetails.createdBy?.username || 'Unknown')
                        ),
                        React.createElement('div', null,
                            React.createElement('p', {
                                className: 'font-semibold'
                            }, 'Status:'),
                            React.createElement('p', null, orderDetails.status)
                        ),
                        orderDetails.table && React.createElement('div', null,
                            React.createElement('p', {
                                className: 'font-semibold'
                            }, 'Table:'),
                            React.createElement('p', null, `Table ${orderDetails.table.id}`)
                        ),
                        orderDetails.room && React.createElement('div', null,
                            React.createElement('p', {
                                className: 'font-semibold'
                            }, 'Room:'),
                            React.createElement('p', null, `Room ${orderDetails.room.number}`)
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
                            orderDetails.items.map((item, index) =>
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
                        `$${orderDetails.total.toFixed(2)}`
                    )
                )
            )
        ),
        React.createElement(Modal, {
            isOpen: isNewOrderModalOpen,
            onClose: () => setIsNewOrderModalOpen(false),
            title: 'New Order',
            size: 'lg'
        },
            React.createElement(OrderForm, {
                onSubmit: handleCreateOrder
            })
        )
    );
}
