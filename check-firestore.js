const admin = require('firebase-admin');
const serviceAccount = require('./tourify-2b2aa-firebase-adminsdk-fbsvc-d9c8115dfb.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkData() {
    try {
        console.log('🔍 Checking Admin User...');
        const userSnap = await db.collection('users').where('email', '==', 'admin@tourify.com').get();
        if (userSnap.empty) {
            console.log('❌ Admin user not found by email!');
        } else {
            userSnap.forEach(doc => {
                console.log(`✅ Found Admin: ${doc.id}`);
                console.log('   Role:', doc.data().role);
            });
        }

        console.log('\n🔍 Checking Messages...');
        const msgSnap = await db.collection('messages').get();
        console.log(`📊 Total messages: ${msgSnap.size}`);
        msgSnap.forEach(doc => {
            console.log(`   - Msg: ${doc.id}, userId: ${doc.data().userId}, text: ${doc.data().message.substring(0, 20)}...`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

checkData();
