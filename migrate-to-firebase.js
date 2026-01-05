const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('./tourify-2b2aa-firebase-adminsdk-fbsvc-d9c8115dfb.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

// Temporary password for all migrated users
const TEMP_PASSWORD = 'TempPass123!';

async function migrateData() {
    try {
        console.log('📖 Reading database.json...');
        const data = await fs.readFile(path.join(__dirname, 'database.json'), 'utf8');
        const database = JSON.parse(data);

        console.log('\n🔐 Migrating Users to Firebase Auth...');
        const userIdMap = {}; // Map old IDs to new Firebase UIDs

        for (const user of database.users) {
            try {
                // Create user in Firebase Auth
                const userRecord = await auth.createUser({
                    email: user.email,
                    password: TEMP_PASSWORD,
                    displayName: user.fullName,
                    disabled: false
                });

                console.log(`✅ Created auth user: ${user.email} (UID: ${userRecord.uid})`);
                userIdMap[user.id] = userRecord.uid;

                // Create user document in Firestore
                await db.collection('users').doc(userRecord.uid).set({
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    createdAt: user.createdAt,
                    profile: user.profile || {
                        fullName: user.fullName,
                        email: user.email,
                        phone: "",
                        avatar: "",
                        preferences: {
                            type: [],
                            difficulty: [],
                            budgetFrom: 0,
                            budgetTo: 5000
                        }
                    },
                    favourites: user.favourites || []
                });

                console.log(`✅ Created Firestore user doc: ${user.email}`);

                // Migrate user's bookings to 'bookings' collection
                if (user.bookings && user.bookings.length > 0) {
                    for (const booking of user.bookings) {
                        await db.collection('bookings').doc(booking.id).set({
                            ...booking,
                            userId: userRecord.uid
                        });
                    }
                    console.log(`  📅 Migrated ${user.bookings.length} bookings for ${user.email}`);
                }

                // Migrate user's support messages to 'messages' collection
                if (user.supportMessages && user.supportMessages.length > 0) {
                    for (const msg of user.supportMessages) {
                        await db.collection('messages').doc(msg.id).set({
                            userId: userRecord.uid,
                            message: msg.text,
                            createdAt: msg.createdAt,
                            answer: msg.answer || "",
                            read: msg.read || false,
                            updatedAt: msg.updatedAt || msg.createdAt
                        });
                    }
                    console.log(`  💬 Migrated ${user.supportMessages.length} messages for ${user.email}`);
                }

            } catch (error) {
                if (error.code === 'auth/email-already-exists') {
                    console.log(`⚠️  User ${user.email} already exists in Auth, skipping...`);
                } else {
                    console.error(`❌ Error migrating user ${user.email}:`, error.message);
                }
            }
        }

        console.log('\n🗺️  Migrating Tours to Firestore...');
        for (const tour of database.tours) {
            try {
                await db.collection('tours').doc(tour.id).set(tour);
                console.log(`✅ Migrated tour: ${tour.title}`);
            } catch (error) {
                console.error(`❌ Error migrating tour ${tour.id}:`, error.message);
            }
        }

        console.log('\n👑 Creating Admin User...');
        try {
            const adminUser = await auth.createUser({
                email: 'admin@tourify.com',
                password: 'admin123', // Default admin password
                displayName: 'Administrator',
                disabled: false
            });

            await db.collection('users').doc(adminUser.uid).set({
                email: 'admin@tourify.com',
                fullName: 'Administrator',
                role: 'admin',
                createdAt: new Date().toISOString()
            });

            console.log(`✅ Created admin user (UID: ${adminUser.uid})`);
        } catch (error) {
            if (error.code === 'auth/email-already-exists') {
                console.log('⚠️  Admin user already exists');
            } else {
                console.error('❌ Error creating admin:', error.message);
            }
        }

        console.log('\n✅ ✅ ✅ Migration Complete! ✅ ✅ ✅');
        console.log('\n📋 Important Notes:');
        console.log(`   • All users have been set with temporary password: "${TEMP_PASSWORD}"`);
        console.log('   • Admin credentials: admin@tourify.com / admin123');
        console.log('   • Users should reset their passwords on first login');
        console.log('\n🗑️  You can now safely delete or archive database.json and server.js.bak');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        process.exit();
    }
}

// Run migration
migrateData();
