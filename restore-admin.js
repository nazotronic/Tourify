const admin = require('firebase-admin');
const serviceAccount = require('./tourify-2b2aa-firebase-adminsdk-fbsvc-d9c8115dfb.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

async function restoreAdmin() {
    const email = 'admin@tourify.com';
    console.log(`🔍 Looking for user: ${email}...`);

    try {
        // 1. Get the user from Auth to find their NEW UID
        const userRecord = await auth.getUserByEmail(email);
        console.log(`✅ Found Auth user! UID: ${userRecord.uid}`);

        // 2. Force-write the Admin document to Firestore
        console.log(`📝 Restoring 'admin' role to Firestore...`);

        await db.collection('users').doc(userRecord.uid).set({
            email: email,
            fullName: 'Administrator',
            role: 'admin', // THIS IS THE KEY FIELD
            createdAt: new Date().toISOString(),
            profile: {
                fullName: 'Administrator',
                email: email,
                avatar: '',
                preferences: {
                    type: [],
                    difficulty: [],
                    budgetFrom: 0,
                    budgetTo: 5000
                }
            }
        });

        console.log(`\n🎉 SUCCESS! Admin permissions restored.`);
        console.log(`👉 You can now log in as Admin.`);

    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            console.error(`❌ Error: User ${email} not found in Authentication.`);
            console.error(`👉 Please create the user '${email}' in Firebase Console -> Authentication first!`);
        } else {
            console.error('❌ Error:', error);
        }
    } finally {
        process.exit();
    }
}

restoreAdmin();
