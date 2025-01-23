function RoomCard({ room, onStatusChange }) {
    const statusColors = {
        available: 'bg-green-500',
        occupied: 'bg-red-500',
        cleaning: 'bg-yellow-500',
        maintenance: 'bg-gray-500'
    };

    return React.createElement('div', {
        className: 'card',
        'data-name': 'room-card'
    },
        React.createElement('div', {
            className: 'flex justify-between items-start mb-4'
        },
            React.createElement('div', null,
                React.createElement('h3', {
                    className: 'text-xl font-semibold mb-1',
                    'data-name': 'room-number'
                }, `Room ${room.number}`),
                React.createElement('span', {
                    className: 'text-sm opacity-75',
                    'data-name': 'room-type'
                }, room.type)
            ),
            React.createElement('div', {
                className: `w-3 h-3 rounded-full ${statusColors[room.status]}`,
                'data-name': 'room-status-indicator'
            })
        ),
        React.createElement('div', {
            className: 'space-y-2'
        },
            React.createElement('div', {
                className: 'flex justify-between'
            },
                React.createElement('span', null, 'Status:'),
                React.createElement('span', {
                    className: 'font-semibold',
                    'data-name': 'room-status'
                }, room.status)
            ),
            React.createElement('div', {
                className: 'flex justify-between'
            },
                React.createElement('span', null, 'Price:'),
                React.createElement('span', {
                    className: 'font-semibold',
                    'data-name': 'room-price'
                }, `$${room.price}/night`)
            )
        ),
        React.createElement('div', {
            className: 'mt-4'
        },
            React.createElement(Button, {
                onClick: () => onStatusChange(room.id),
                className: 'w-full',
                'data-name': 'change-status-button'
            }, 'Change Status')
        )
    );
}
