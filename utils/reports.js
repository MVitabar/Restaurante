async function generateReport(type, filters = {}) {
    try {
        let reportData = null;
        
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

        if (!reportData) {
            throw new Error('No data generated for report');
        }

        return reportData;
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function generateDailySalesReport(filters) {
    try {
        const orders = await query('orders') || [];
        let filteredOrders = orders;

        if (filters.dateRange) {
            const startDate = new Date(filters.dateRange.start);
            const endDate = new Date(filters.dateRange.end);
            endDate.setHours(23, 59, 59, 999);

            filteredOrders = orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= startDate && orderDate <= endDate;
            });
        }

        const totalSales = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const itemsSold = filteredOrders.reduce((sum, order) => sum + (order.items?.length || 0), 0);

        return {
            totalSales,
            itemsSold,
            orderCount: filteredOrders.length,
            orders: filteredOrders.map(order => ({
                id: order.id,
                total: order.total || 0,
                items: order.items?.length || 0,
                date: order.createdAt,
                createdBy: order.createdBy?.username || 'Unknown'
            }))
        };
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function generateRoomOccupancyReport(filters) {
    try {
        const rooms = await query('rooms') || [];
        const orders = await query('orders') || [];
        
        const occupied = rooms.filter(room => room.status === 'occupied').length;
        const available = rooms.filter(room => room.status === 'available').length;

        let roomHistory = [];

        if (filters.dateRange) {
            const startDate = new Date(filters.dateRange.start);
            const endDate = new Date(filters.dateRange.end);
            endDate.setHours(23, 59, 59, 999);

            roomHistory = orders
                .filter(order => order.roomId && new Date(order.createdAt) >= startDate && new Date(order.createdAt) <= endDate)
                .map(order => ({
                    roomId: order.roomId,
                    date: order.createdAt,
                    status: order.status
                }));
        }

        return {
            totalRooms: rooms.length || 0,
            occupied: occupied || 0,
            available: available || 0,
            occupancyRate: rooms.length ? (occupied / rooms.length) * 100 : 0,
            rooms: rooms.map(room => ({
                number: room.number,
                status: room.status,
                type: room.type,
                history: roomHistory.filter(h => h.roomId === room.id)
            }))
        };
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function generateTableUsageReport(filters) {
    try {
        const tables = await query('tables') || [];
        const orders = await query('orders') || [];
        
        const occupied = tables.filter(table => table.status === 'occupied').length;
        const available = tables.filter(table => table.status === 'available').length;

        let tableHistory = [];

        if (filters.dateRange) {
            const startDate = new Date(filters.dateRange.start);
            const endDate = new Date(filters.dateRange.end);
            endDate.setHours(23, 59, 59, 999);

            tableHistory = orders
                .filter(order => order.tableId && new Date(order.createdAt) >= startDate && new Date(order.createdAt) <= endDate)
                .map(order => ({
                    tableId: order.tableId,
                    date: order.createdAt,
                    status: order.status,
                    total: order.total || 0
                }));
        }

        return {
            totalTables: tables.length || 0,
            occupied: occupied || 0,
            available: available || 0,
            utilizationRate: tables.length ? (occupied / tables.length) * 100 : 0,
            tables: tables.map(table => ({
                id: table.id,
                status: table.status,
                history: tableHistory.filter(h => h.tableId === table.id)
            }))
        };
    } catch (error) {
        reportError(error);
        throw error;
    }
}
