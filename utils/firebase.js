const firebaseConfig = {
    apiKey: "AIzaSyBkGY3e9bRalT30VKf9cV-VUlKY5gSx_MQ",
    authDomain: "restaurante-ad850.firebaseapp.com",
    projectId: "restaurante-ad850",
    storageBucket: "restaurante-ad850.firebasestorage.app",
    messagingSenderId: "80588710474",
    appId: "1:80588710474:web:93a4177a5de638610f3cb3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Enable Firestore offline persistence
firebase.firestore().enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            console.log('The current browser does not support persistence.');
        }
    });

const db = firebase.firestore();
const auth = firebase.auth();

// Sign in anonymously to allow database access
async function ensureAnonymousAuth() {
    try {
        if (!auth.currentUser) {
            await auth.signInAnonymously();
        }
    } catch (error) {
        console.error("Error signing in anonymously:", error);
    }
}

// Collection references
const usersRef = db.collection('users');
const tablesRef = db.collection('tables');
const roomsRef = db.collection('rooms');
const ordersRef = db.collection('orders');
const menuItemsRef = db.collection('menuItems');

// Initialize collections with default data if empty
async function initializeDatabase() {
    try {
        // Ensure we have authentication
        await ensureAnonymousAuth();

        // Check if collections are empty
        const [users, tables, rooms, menuItems] = await Promise.all([
            usersRef.get(),
            tablesRef.get(),
            roomsRef.get(),
            menuItemsRef.get()
        ]);

        const batch = db.batch();

        // Initialize users if empty
        if (users.empty) {
            const defaultUsers = [
                {
                    username: 'admin',
                    password: 'admin123',
                    role: 'admin',
                    permissions: ['all']
                },
                {
                    username: 'waiter',
                    password: 'waiter123',
                    role: 'waiter',
                    permissions: ['dashboard.view', 'tables.view', 'tables.edit', 'orders.view', 'orders.edit', 'menu.view']
                },
                {
                    username: 'receptionist',
                    password: 'reception123',
                    role: 'receptionist',
                    permissions: ['dashboard.view', 'rooms.view', 'rooms.edit', 'tables.view']
                }
            ];

            defaultUsers.forEach(user => {
                const userRef = usersRef.doc();
                batch.set(userRef, {
                    ...user,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        }

        // Initialize tables if empty
        if (tables.empty) {
            Array.from({ length: 18 }).forEach((_, i) => {
                const tableRef = tablesRef.doc();
                batch.set(tableRef, {
                    number: i + 1,
                    status: 'available',
                    seats: i % 3 === 0 ? 6 : 4, // Alternating between 4 and 6 seats
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        }

        // Initialize rooms if empty
        if (rooms.empty) {
            Array.from({ length: 20 }).forEach((_, i) => {
                const roomRef = roomsRef.doc();
                batch.set(roomRef, {
                    number: `${i + 101}`,
                    status: 'available',
                    type: i % 2 === 0 ? 'standard' : 'deluxe',
                    price: 100 + Math.floor(Math.random() * 200),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        }

        // Initialize menu items if empty
        if (menuItems.empty) {
            const defaultMenuItems = [
                { name: 'Burger', category: 'food', price: 15 },
                { name: 'Pizza', category: 'food', price: 20 },
                { name: 'Salad', category: 'food', price: 12 },
                { name: 'Coca Cola', category: 'drinks', price: 5 },
                { name: 'Ice Cream', category: 'dessert', price: 8 }
            ];

            defaultMenuItems.forEach(item => {
                const itemRef = menuItemsRef.doc();
                batch.set(itemRef, {
                    ...item,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        }

        await batch.commit();
        return true;
    } catch (error) {
        console.error('Error initializing database:', error);
        return false;
    }
}

// Export needed functions and objects
window.db = db;
window.auth = auth;
window.initializeDatabase = initializeDatabase;
window.ensureAnonymousAuth = ensureAnonymousAuth;

// Add Firestore rules (to be copied to Firebase Console)
const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
`;

// Initialize authentication immediately
ensureAnonymousAuth();
