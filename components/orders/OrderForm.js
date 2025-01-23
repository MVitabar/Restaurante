function OrderForm({ onSubmit, initialData = null }) {
    const [items, setItems] = React.useState([]);
    const [selectedTable, setSelectedTable] = React.useState(null);
    const [selectedRoom, setSelectedRoom] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [tables, setTables] = React.useState([]);
    const [rooms, setRooms] = React.useState([]);
    const [menuItems, setMenuItems] = React.useState([]);

    React.useEffect(() => {
        try {
            const fetchData = async () => {
                const [tablesData, roomsData, menuData] = await Promise.all([
                    query('tables'),
                    query('rooms'),
                    query('menuItems')
                ]);
                setTables(tablesData);
                setRooms(roomsData);
                setMenuItems(menuData);
            };
            fetchData();
        } catch (error) {
            reportError(error);
        }
    }, []);

    React.useEffect(() => {
        if (initialData) {
            setItems(initialData.items || []);
            setSelectedTable(initialData.tableId || null);
            setSelectedRoom(initialData.roomId || null);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const orderData = {
                items,
                tableId: selectedTable,
                roomId: selectedRoom,
                total: calculateTotal(),
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            if (selectedTable) {
                await update('tables', selectedTable, { status: 'occupied' });
            }

            await onSubmit(orderData);
        } catch (error) {
            reportError(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleAddItem = () => {
        setItems([...items, { menuItemId: '', quantity: 1, price: 0, name: '' }]);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        if (field === 'menuItemId') {
            const menuItem = menuItems.find(item => item.id === parseInt(value));
            if (menuItem) {
                newItems[index] = {
                    ...newItems[index],
                    menuItemId: menuItem.id,
                    name: menuItem.name,
                    price: menuItem.price
                };
            }
        } else {
            newItems[index][field] = value;
        }
        setItems(newItems);
    };

    return React.createElement('form', {
        onSubmit: handleSubmit,
        className: 'space-y-6',
        'data-name': 'order-form'
    },
        React.createElement('div', {
            className: 'grid grid-cols-2 gap-4'
        },
            React.createElement('div', {
                className: 'space-y-2'
            },
                React.createElement('label', {
                    className: 'block text-sm font-medium'
                }, 'Table'),
                React.createElement('select', {
                    value: selectedTable || '',
                    onChange: (e) => setSelectedTable(e.target.value ? parseInt(e.target.value) : null),
                    className: 'input w-full',
                    'data-name': 'table-select'
                },
                    React.createElement('option', { value: '' }, 'Select Table'),
                    tables
                        .filter(table => table.status === 'available')
                        .map(table =>
                            React.createElement('option', {
                                key: table.id,
                                value: table.id
                            }, `Table ${table.id} (${table.seats} seats)`)
                        )
                )
            ),
            React.createElement('div', {
                className: 'space-y-2'
            },
                React.createElement('label', {
                    className: 'block text-sm font-medium'
                }, 'Room'),
                React.createElement('select', {
                    value: selectedRoom || '',
                    onChange: (e) => setSelectedRoom(e.target.value ? parseInt(e.target.value) : null),
                    className: 'input w-full',
                    'data-name': 'room-select'
                },
                    React.createElement('option', { value: '' }, 'Select Room'),
                    rooms
                        .filter(room => room.status === 'occupied')
                        .map(room =>
                            React.createElement('option', {
                                key: room.id,
                                value: room.id
                            }, `Room ${room.number}`)
                        )
                )
            )
        ),
        React.createElement('div', {
            className: 'space-y-4'
        },
            React.createElement('h3', {
                className: 'text-lg font-semibold'
            }, 'Items'),
            items.map((item, index) =>
                React.createElement('div', {
                    key: index,
                    className: 'flex items-center gap-4'
                },
                    React.createElement('select', {
                        value: item.menuItemId || '',
                        onChange: (e) => handleItemChange(index, 'menuItemId', e.target.value),
                        className: 'input flex-1',
                        'data-name': `item-select-${index}`
                    },
                        React.createElement('option', { value: '' }, 'Select Item'),
                        menuItems.map(menuItem =>
                            React.createElement('option', {
                                key: menuItem.id,
                                value: menuItem.id
                            }, `${menuItem.name} ($${menuItem.price})`)
                        )
                    ),
                    React.createElement(Input, {
                        type: 'number',
                        value: item.quantity,
                        onChange: (e) => handleItemChange(index, 'quantity', parseInt(e.target.value)),
                        min: 1,
                        className: 'w-20',
                        'data-name': `item-quantity-${index}`
                    }),
                    React.createElement('span', {
                        className: 'w-24 text-right'
                    }, `$${(item.price * item.quantity).toFixed(2)}`),
                    React.createElement(Button, {
                        onClick: () => {
                            const newItems = [...items];
                            newItems.splice(index, 1);
                            setItems(newItems);
                        },
                        type: 'button',
                        variant: 'outline',
                        'data-name': `remove-item-${index}`
                    }, '×')
                )
            ),
            React.createElement(Button, {
                onClick: handleAddItem,
                type: 'button',
                variant: 'secondary',
                className: 'w-full',
                'data-name': 'add-item-button'
            }, 'Add Item')
        ),
        React.createElement('div', {
            className: 'flex justify-between items-center text-xl font-semibold'
        },
            'Total:',
            `$${calculateTotal().toFixed(2)}`
        ),
        React.createElement(Button, {
            type: 'submit',
            className: 'w-full',
            disabled: loading || items.length === 0,
            'data-name': 'submit-order-button'
        }, loading ? 'Processing...' : 'Submit Order')
    );
}
