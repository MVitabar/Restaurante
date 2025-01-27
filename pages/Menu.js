function Menu() {
    const [menuItems, setMenuItems] = React.useState([]);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const { hasEditPermission } = useAuth();
    const canEdit = hasEditPermission('menu');

    React.useEffect(() => {
        try {
            const fetchMenu = async () => {
                const data = await query('menuItems');
                setMenuItems(data);
            };
            fetchMenu();
        } catch (error) {
            reportError(error);
        }
    }, []);

    const handleCreateItem = async (itemData) => {
        try {
            if (!canEdit) return;
            const newItem = await insert('menuItems', itemData);
            setMenuItems([...menuItems, newItem]);
            setIsModalOpen(false);
        } catch (error) {
            reportError(error);
        }
    };

    const handleEditItem = async (itemData) => {
        try {
            if (!canEdit) return;
            await update('menuItems', itemData.id, itemData);
            setMenuItems(menuItems.map(item =>
                item.id === itemData.id ? itemData : item
            ));
            setIsModalOpen(false);
        } catch (error) {
            reportError(error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            if (!canEdit) return;
            await remove('menuItems', itemId);
            setMenuItems(menuItems.filter(item => item.id !== itemId));
        } catch (error) {
            reportError(error);
        }
    };

    return React.createElement('div', {
        className: 'space-y-6',
        'data-name': 'menu-page'
    },
        React.createElement('div', {
            className: 'flex justify-between items-center'
        },
            React.createElement('h2', {
                className: 'text-2xl font-bold'
            }, 'Menu Items'),
            canEdit && React.createElement(Button, {
                onClick: () => setIsModalOpen(true),
                'data-name': 'add-menu-item-button'
            }, 'Add Item')
        ),
        React.createElement(MenuGrid, {
            items: menuItems,
            onEdit: canEdit ? (item) => {
                setSelectedItem(item);
                setIsModalOpen(true);
            } : null,
            onDelete: canEdit ? handleDeleteItem : null
        }),
        isModalOpen && React.createElement(Modal, {
            isOpen: isModalOpen,
            onClose: () => {
                setIsModalOpen(false);
                setSelectedItem(null);
            },
            title: selectedItem ? 'Edit Menu Item' : 'New Menu Item'
        },
            React.createElement('form', {
                onSubmit: async (e) => {
                    e.preventDefault();
                    if (!canEdit) return;
                    const formData = new FormData(e.target);
                    const itemData = {
                        name: formData.get('name'),
                        category: formData.get('category'),
                        price: parseFloat(formData.get('price'))
                    };
                    if (selectedItem) {
                        await handleEditItem({ ...itemData, id: selectedItem.id });
                    } else {
                        await handleCreateItem(itemData);
                    }
                },
                className: 'space-y-4'
            },
                React.createElement(Input, {
                    name: 'name',
                    label: 'Item Name',
                    defaultValue: selectedItem?.name || '',
                    required: true
                }),
                React.createElement(Input, {
                    name: 'category',
                    label: 'Category',
                    defaultValue: selectedItem?.category || '',
                    required: true
                }),
                React.createElement(Input, {
                    name: 'price',
                    label: 'Price',
                    type: 'number',
                    step: '0.01',
                    defaultValue: selectedItem?.price || '',
                    required: true
                }),
                React.createElement(Button, {
                    type: 'submit',
                    className: 'w-full',
                    'data-name': 'submit-menu-item-button'
                }, selectedItem ? 'Update Item' : 'Create Item')
            )
        )
    );
}
