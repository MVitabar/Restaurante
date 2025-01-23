function RoomGrid({ rooms, onStatusChange }) {
    return React.createElement('div', {
        className: 'grid-container',
        'data-name': 'room-grid'
    },
        rooms.map(room =>
            React.createElement(RoomCard, {
                key: room.id,
                room,
                onStatusChange
            })
        )
    );
}
