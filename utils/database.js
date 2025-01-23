const DB = {
    tables: [],
    rooms: [],
    orders: [],
    menuItems: [],
    users: []
};

async function initializeDatabase() {
    try {
        // Initialize with sample data
        DB.tables = Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            status: 'available',
            seats: 4,
            associatedRoom: null
        }));

        DB.rooms = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            number: `${i + 101}`,
            status: 'available',
            price: 100 + Math.floor(Math.random() * 200),
            type: i % 2 === 0 ? 'standard' : 'deluxe'
        }));

        DB.menuItems = [
            { id: 1, name: 'Burger', category: 'food', price: 15 },
            { id: 2, name: 'Pizza', category: 'food', price: 20 },
            { id: 3, name: 'Salad', category: 'food', price: 12 },
            { id: 4, name: 'Coca Cola', category: 'drinks', price: 5 },
            { id: 5, name: 'Ice Cream', category: 'dessert', price: 8 }
        ];

        DB.users = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                permissions: ['all']
            }
        ];

        return true;
    } catch (error) {
        reportError(error);
        return false;
    }
}

async function query(collection, filters = {}) {
    try {
        let results = [...DB[collection]];
        
        Object.entries(filters).forEach(([key, value]) => {
            results = results.filter(item => item[key] === value);
        });

        return results;
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function insert(collection, data) {
    try {
        const newId = Math.max(...DB[collection].map(item => item.id), 0) + 1;
        const newItem = { ...data, id: newId };
        DB[collection].push(newItem);
        return newItem;
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function update(collection, id, data) {
    try {
        const index = DB[collection].findIndex(item => item.id === id);
        if (index === -1) throw new Error('Item not found');
        
        DB[collection][index] = { ...DB[collection][index], ...data };
        return DB[collection][index];
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function remove(collection, id) {
    try {
        const index = DB[collection].findIndex(item => item.id === id);
        if (index === -1) throw new Error('Item not found');
        
        DB[collection].splice(index, 1);
        return true;
    } catch (error) {
        reportError(error);
        throw error;
    }
}
