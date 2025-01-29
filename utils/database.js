async function query(collection, filters = {}) {
    try {
        // Ensure we have authentication before any database operation
        await ensureAnonymousAuth();
        
        let ref = db.collection(collection);
        
        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                ref = ref.where(key, '==', value);
            }
        });

        const snapshot = await ref.get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function insert(collection, data) {
    try {
        // Ensure we have authentication before any database operation
        await ensureAnonymousAuth();

        const docRef = await db.collection(collection).add({
            ...data,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        const doc = await docRef.get();
        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function update(collection, id, data) {
    try {
        // Ensure we have authentication before any database operation
        await ensureAnonymousAuth();

        const docRef = db.collection(collection).doc(id);
        await docRef.update({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        const doc = await docRef.get();
        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function remove(collection, id) {
    try {
        // Ensure we have authentication before any database operation
        await ensureAnonymousAuth();

        await db.collection(collection).doc(id).delete();
        return true;
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function subscribeToCollection(collection, callback) {
    try {
        // Ensure we have authentication before any database operation
        await ensureAnonymousAuth();

        return db.collection(collection).onSnapshot(snapshot => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(docs);
        });
    } catch (error) {
        reportError(error);
        throw error;
    }
}

// Initialize database and export function
async function initializeDatabaseAndGetData() {
    try {
        // Ensure we have authentication before initialization
        await ensureAnonymousAuth();
        await initializeDatabase();
        return true;
    } catch (error) {
        reportError(error);
        return false;
    }
}
