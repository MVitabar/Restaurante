function MenuCard({ item, onEdit, onDelete }) {
    const { hasEditPermission } = useAuth();
    const canEdit = hasEditPermission('menu');

    return React.createElement('div', {
        className: 'card flex flex-col',
        'data-name': 'menu-card'
    },
        React.createElement('div', {
            className: 'flex justify-between items-start mb-4'
        },
            React.createElement('div', null,
                React.createElement('h3', {
                    className: 'text-xl font-semibold mb-1',
                    'data-name': 'menu-item-name'
                }, item.name),
                React.createElement('span', {
                    className: 'text-sm opacity-75',
                    'data-name': 'menu-item-category'
                }, item.category)
            ),
            React.createElement('span', {
                className: 'text-xl font-bold',
                'data-name': 'menu-item-price'
            }, `$${item.price.toFixed(2)}`)
        ),
        canEdit && React.createElement('div', {
            className: 'flex gap-2 mt-auto'
        },
            React.createElement(Button, {
                onClick: () => onEdit(item),
                variant: 'secondary',
                className: 'flex-1',
                'data-name': 'edit-menu-item-button'
            }, 'Edit'),
            React.createElement(Button, {
                onClick: () => onDelete(item.id),
                variant: 'outline',
                className: 'flex-1',
                'data-name': 'delete-menu-item-button'
            }, 'Delete')
        )
    );
}
