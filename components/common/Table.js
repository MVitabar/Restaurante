function Table({ columns, data, onRowClick }) {
    return React.createElement('div', {
        className: 'overflow-x-auto',
        'data-name': 'table-container'
    },
        React.createElement('table', {
            className: 'table',
            'data-name': 'table'
        },
            React.createElement('thead', null,
                React.createElement('tr', null,
                    columns.map(column => 
                        React.createElement('th', {
                            key: column.key,
                            className: 'text-left',
                            'data-name': `table-header-${column.key}`
                        }, column.label)
                    )
                )
            ),
            React.createElement('tbody', null,
                data.map((row, index) =>
                    React.createElement('tr', {
                        key: row.id || index,
                        onClick: () => onRowClick && onRowClick(row),
                        className: 'hover:bg-white/5 cursor-pointer',
                        'data-name': `table-row-${index}`
                    },
                        columns.map(column =>
                            React.createElement('td', {
                                key: `${row.id}-${column.key}`,
                                'data-name': `table-cell-${column.key}`
                            }, row[column.key])
                        )
                    )
                )
            )
        )
    );
}
