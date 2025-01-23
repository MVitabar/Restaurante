async function generateReport(type, filters = {}) {
    try {
        let reportData = [];
        
        switch (type) {
            case 'daily-sales':
                reportData = await generateDailySalesReport(filters);
                break;
            case 'room-occupancy':
                reportData = await generateRoomOccupancyReport(filters);
                break;
            case 'table-usage':
                reportData = await generateTableUsageReport(filters);
                break;
            default:
                throw new Error('Invalid report type');
        }

        return reportData;
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function generateDailySalesReport(filters) {
    try {
        const orders = await query('orders', filters);
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const itemsSold = orders.reduce((sum, order) => sum + order.items.length, 0);

        return {
            totalSales,
            itemsSold,
            orderCount: orders.length,
            orders: orders.map(order => ({
                id: order.id,
                total: order.total,
                items: order.items.length,
                date: order.createdAt
            }))
        };
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function generateRoomOccupancyReport(filters) {
    try {
        const rooms = await query('rooms', filters);
        const occupied = rooms.filter(room => room.status === 'occupied').length;
        const available = rooms.filter(room => room.status === 'available').length;

        return {
            totalRooms: rooms.length,
            occupied,
            available,
            occupancyRate: (occupied / rooms.length) * 100,
            rooms: rooms.map(room => ({
                number: room.number,
                status: room.status,
                type: room.type
            }))
        };
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function generateTableUsageReport(filters) {
    try {
        const tables = await query('tables', filters);
        const occupied = tables.filter(table => table.status === 'occupied').length;
        const available = tables.filter(table => table.status === 'available').length;

        return {
            totalTables: tables.length,
            occupied,
            available,
            utilizationRate: (occupied / tables.length) * 100,
            tables: tables.map(table => ({
                id: table.id,
                status: table.status,
                associatedRoom: table.associatedRoom
            }))
        };
    } catch (error) {
        reportError(error);
        throw error;
    }
}
