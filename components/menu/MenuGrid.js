function MenuGrid({ items, onEdit, onDelete }) {
    const categories = [...new Set(items.map(item => item.category))];

    return React.createElement('div', {
        className: 'space-y-8',
        'data-name': 'menu-grid'
    },
        categories.map(category =>
            React.createElement('div', {
                key: category,
                className: 'space-y-4',
                'data-name': `menu-category-${category}`
            },
                React.createElement('h2', {
                    className: 'text-2xl font-bold text-glow'
                }, category.charAt(0).toUpperCase() + category.slice(1)),
                React.createElement('div', {
                    className: 'grid-container'
                },
                    items
                        .filter(item => item.category === category)
                        .map(item =>
                            React.createElement(MenuCard, {
                                key: item.id,
                                item,
                                onEdit,
                                onDelete
                            })
                        )
                )
            )
        )
    );
}
