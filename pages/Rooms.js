function Rooms() {
    const [rooms, setRooms] = React.useState([]);
    const [selectedRoom, setSelectedRoom] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    React.useEffect(() => {
        try {
            const fetchRooms = async () => {
                const data = await query('rooms');
                setRooms(data);
            };
            fetchRooms();
        } catch (error) {
            reportError(error);
        }
    }, []);

    const handleStatusChange = async (roomId) => {
        try {
            setSelectedRoom(rooms.find(r => r.id === roomId));
            setIsModalOpen(true);
        } catch (error) {
            reportError(error);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            await update('rooms', selectedRoom.id, { status: newStatus });
            setRooms(rooms.map(room =>
                room.id === selectedRoom.id
                    ? { ...room, status: newStatus }
                    : room
            ));
            setIsModalOpen(false);
        } catch (error) {
            reportError(error);
        }
    };

    return React.createElement('div', {
        className: 'space-y-6',
        'data-name': 'rooms-page'
    },
        React.createElement('div', {
            className: 'flex justify-between items-center'
        },
            React.createElement('h2', {
                className: 'text-2xl font-bold'
            }, 'Hotel Rooms'),
            React.createElement(Button, {
                onClick: () => setIsModalOpen(true),
                'data-name': 'add-room-button'
            }, 'Add Room')
        ),
        React.createElement(RoomGrid, {
            rooms,
            onStatusChange: handleStatusChange
        }),
        React.createElement(Modal, {
            isOpen: isModalOpen,
            onClose: () => setIsModalOpen(false),
            title: 'Update Room Status'
        },
            React.createElement('div', {
                className: 'space-y-4'
            },
                ['available', 'occupied', 'cleaning', 'maintenance'].map(status =>
                    React.createElement(Button, {
                        key: status,
                        onClick: () => handleUpdateStatus(status),
                        className: 'w-full mb-2',
                        variant: selectedRoom?.status === status ? 'primary' : 'outline',
                        'data-name': `status-button-${status}`
                    }, status.charAt(0).toUpperCase() + status.slice(1))
                )
            )
        )
    );
}
