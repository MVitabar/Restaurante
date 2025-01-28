function Tables() {
    const [tables, setTables] = React.useState([]);
    const [orders, setOrders] = React.useState([]);
    const [selectedTable, setSelectedTable] = React.useState(null);
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false);
    const [isCompletionModalOpen, setIsCompletionModalOpen] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [clientType, setClientType] = React.useState('passante');
    const [availableRooms, setAvailableRooms] = React.useState([]);
    const [selectedRoom, setSelectedRoom] = React.useState(null);
    const { t } = useTranslation();

    React.useEffect(() => {
        try {
            const fetchData = async () => {
                const [tablesData, ordersData, roomsData] = await Promise.all([
                    query('tables'),
                    query('orders'),
                    query('rooms')
                ]);
                setTables(tablesData);
                setOrders(ordersData);
                setAvailableRooms(roomsData.filter(room => room.status === 'occupied'));
            };
            fetchData();
        } catch (error) {
            reportError(error);
        }
    }, []);

    const handleTableClick = (table) => {
        setSelectedTable(table);
        const currentOrder = orders.find(order => 
            order.tableId === table.id && order.status === 'pending'
        );
        if (currentOrder) {
            setSelectedOrder(currentOrder);
            setIsOrderModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            if (newStatus === 'occupied') {
                const orderData = {
                    tableId: selectedTable.id,
                    status: 'pending',
                    items: [],
                    total: 0,
                    createdAt: new Date().toISOString(),
                    clientType: clientType,
                    roomId: clientType === 'hotel' ? selectedRoom : null,
                    clientName: clientType === 'passante' ? 'Passante' : `Room ${selectedRoom}`
                };
                
                await insert('orders', orderData);
                const updatedOrders = await query('orders');
                setOrders(updatedOrders);
            }

            await update('tables', selectedTable.id, { 
                status: newStatus,
                clientType: newStatus === 'occupied' ? clientType : null,
                roomId: newStatus === 'occupied' && clientType === 'hotel' ? selectedRoom : null
            });

            setTables(tables.map(table =>
                table.id === selectedTable.id
                    ? { 
                        ...table, 
                        status: newStatus,
                        clientType: newStatus === 'occupied' ? clientType : null,
                        roomId: newStatus === 'occupied' && clientType === 'hotel' ? selectedRoom : null
                    }
                    : table
            ));
            setIsModalOpen(false);
        } catch (error) {
            reportError(error);
        }
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
                await update('tables', selectedOrder.tableId, { 
                    status: 'available',
                    clientType: null,
                    roomId: null
                });
                setTables(tables.map(table =>
                    table.id === selectedOrder.tableId
                        ? { 
                            ...table, 
                            status: 'available',
                            clientType: null,
                            roomId: null
                        }
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
            }, t('restaurantTables'))
        ),
        React.createElement(TableGrid, {
            tables,
            orders,
            onTableClick: handleTableClick
        }),
        React.createElement(Modal, {
            isOpen: isModalOpen,
            onClose: () => setIsModalOpen(false),
            title: t('updateTableStatus')
        },
            React.createElement('div', {
                className: 'space-y-4'
            },
                React.createElement('div', {
                    className: 'mb-4'
                },
                    React.createElement('label', {
                        className: 'block text-sm font-medium mb-2'
                    }, t('clientType')),
                    React.createElement('select', {
                        value: clientType,
                        onChange: (e) => setClientType(e.target.value),
                        className: 'input w-full',
                        'data-name': 'client-type-select'
                    },
                        React.createElement('option', { value: 'passante' }, t('walkInGuest')),
                        React.createElement('option', { value: 'hotel' }, t('hotelGuest'))
                    )
                ),
                clientType === 'hotel' && React.createElement('div', {
                    className: 'mb-4'
                },
                    React.createElement('label', {
                        className: 'block text-sm font-medium mb-2'
                    }, t('selectRoom')),
                    React.createElement('select', {
                        value: selectedRoom || '',
                        onChange: (e) => setSelectedRoom(e.target.value),
                        className: 'input w-full',
                        required: clientType === 'hotel',
                        'data-name': 'room-select'
                    },
                        React.createElement('option', { value: '' }, t('selectRoom')),
                        availableRooms.map(room =>
                            React.createElement('option', {
                                key: room.id,
                                value: room.id
                            }, `${t('room')} ${room.number}`)
                        )
                    )
                ),
                ['available', 'occupied', 'reserved'].map(status =>
                    React.createElement(Button, {
                        key: status,
                        onClick: () => handleUpdateStatus(status),
                        className: `w-full mb-2 text-white ${selectedTable?.status === status ? 'bg-purple-600' : 'bg-purple-500 hover:bg-purple-600'}`,
                        disabled: status === 'occupied' && clientType === 'hotel' && !selectedRoom,
                        variant: selectedTable?.status === status ? 'primary' : 'outline',
                        'data-name': `status-button-${status}`
                    }, t(status))
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
            title: isEditing ? t('editOrder') : t('orderDetails'),
            size: 'lg'
        },
            selectedOrder && (isEditing ?
                React.createElement(OrderForm, {
                    initialData: selectedOrder,
                    onSubmit: handleUpdateOrder,
                    clientType: clientType
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
                        }, t('editOrder')),
                        selectedOrder.status === 'pending' && React.createElement(Button, {
                            onClick: () => setIsCompletionModalOpen(true),
                            'data-name': 'complete-order-button'
                        }, t('completeOrder'))
                    ),
                    React.createElement('div', {
                        className: 'grid grid-cols-2 gap-4'
                    },
                        React.createElement('div', null,
                            React.createElement('p', {
                                className: 'font-semibold'
                            }, t('orderID')),
                            React.createElement('p', null, selectedOrder.id)
                        ),
                        React.createElement('div', null,
                            React.createElement('p', {
                                className: 'font-semibold'
                            }, t('clientType')),
                            React.createElement('p', null, t(selectedOrder.clientType))
                        ),
                        selectedOrder.roomId && React.createElement('div', null,
                            React.createElement('p', {
                                className: 'font-semibold'
                            }, t('roomNumber')),
                            React.createElement('p', null, selectedOrder.clientName)
                        )
                    ),
                    React.createElement('div', {
                        className: 'mt-4'
                    },
                        React.createElement('h3', {
                            className: 'font-semibold mb-2'
                        }, t('items')),
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
                        t('total'),
                        `$${selectedOrder.total.toFixed(2)}`
                    )
                )
            )
        ),
        React.createElement(Modal, {
            isOpen: isCompletionModalOpen,
            onClose: () => setIsCompletionModalOpen(false),
            title: t('completeOrder'),
            size: 'md'
        },
            selectedOrder && React.createElement('div', {
                className: 'space-y-4'
            },
                React.createElement('p', {
                    className: 'text-lg'
                }, t('pleaseConfirm')),
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
                        t('total'),
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
                    }, t('confirmCompletion')),
                    React.createElement(Button, {
                        onClick: () => setIsCompletionModalOpen(false),
                        variant: 'outline',
                        className: 'flex-1',
                        'data-name': 'cancel-completion-button'
                    }, t('cancel'))
                )
            )
        )
    );
}
