// Firebase API Implementation
import { auth, db } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updatePassword as firebaseUpdatePassword
} from "firebase/auth";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    query,
    where
} from "firebase/firestore";

// Helper to get doc data with ID
const getDocData = (docSnap) => {
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
};

// Authentication API
export const authAPI = {
    register: async (email, password, fullName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user document in Firestore
            const userDoc = {
                email: user.email,
                fullName: fullName || email.split('@')[0],
                role: 'user',
                createdAt: new Date().toISOString(),
                profile: {
                    fullName: fullName || email.split('@')[0],
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
                favourites: [],
                bookings: [], // Legacy array, but we use 'bookings' collection
                supportMessages: [] // Legacy array
            };

            await setDoc(doc(db, "users", user.uid), userDoc);

            return { user: { uid: user.uid, ...userDoc } };
        } catch (error) {
            console.error("Register error", error);
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Fetch user profile
            const userDocRef = doc(db, "users", userCredential.user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                // Should not happen if registered correctly
                return { user: { uid: userCredential.user.uid, email } };
            }

            return { user: { id: userCredential.user.uid, ...userDocSnap.data() } };
        } catch (error) {
            console.error("Login error", error);
            throw error;
        }
    },

    adminLogin: async (password) => {
        // Firebase doesn't support password-only login. 
        // We assume Admin uses email/pass login via normal login, 
        // OR we hardcode a check here?
        // User requested "Identify Admin by role in DB".
        // But Admin Page uses `adminLogin(password)`.
        // We can simulate it by trying to login as specific admin email?
        // OR we just deprecate this and tell user to use normal login?
        // FOR NOW: Let's assume Admin Login is handled via specific email/pass in UI?
        // NO, UI asks for Password ONLY.
        // Hack: Login as hardcoded admin email with provided password?
        try {
            await signInWithEmailAndPassword(auth, "admin@tourify.com", password);
            // Check role
            const user = auth.currentUser;
            const docSnap = await getDoc(doc(db, "users", user.uid));
            if (docSnap.exists() && docSnap.data().role === 'admin') {
                return { success: true, role: 'admin' };
            }
            throw new Error("Not an admin");
        } catch (e) {
            throw new Error("Invalid admin credentials");
        }
    },

    logout: async () => {
        await signOut(auth);
    }
};

// User API
export const userAPI = {
    getUser: async (id) => {
        const docRef = doc(db, "users", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) return { id: snap.id, ...snap.data() };
        throw new Error("User not found");
    },

    updateUser: async (id, updates) => {
        try {
            const docRef = doc(db, "users", id);
            await updateDoc(docRef, updates);
            // Return updated data
            const snap = await getDoc(docRef);
            return { id: snap.id, ...snap.data() };
        } catch (e) {
            console.error("Update User Error", e);
            throw e;
        }
    },

    changePassword: async (id, newPassword) => {
        // Only works if id === current user
        const user = auth.currentUser;
        if (user && user.uid === id) {
            await firebaseUpdatePassword(user, newPassword);
        } else {
            throw new Error("Cannot change password of another user");
        }
    },

    updateProfile: async (id, data) => {
        // Alias for updateUser typically
        return userAPI.updateUser(id, data);
    },

    getAllUsers: async () => {
        const q = query(collection(db, "users"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    deleteUser: async (id) => {
        await deleteDoc(doc(db, "users", id));
    }
};

// Tour API
export const tourAPI = {
    getAllTours: async () => {
        const snap = await getDocs(collection(db, "tours"));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    getTour: async (id) => {
        const snap = await getDoc(doc(db, "tours", id));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    createTour: async (tourData) => {
        // Use custom ID if provided, else auto-id
        const ref = tourData.id ? doc(db, "tours", tourData.id.toString()) : doc(collection(db, "tours"));
        await setDoc(ref, tourData);
        return { id: ref.id, ...tourData };
    },

    updateTour: async (id, updates) => {
        await updateDoc(doc(db, "tours", id), updates);
        return { id, ...updates };
    },

    deleteTour: async (id) => {
        await deleteDoc(doc(db, "tours", id));
    },

    initializeTours: async (tours) => {
        // Batch write?
        // For simplicity loop
        for (const t of tours) {
            const ref = doc(db, "tours", t.id.toString());
            await setDoc(ref, t);
        }
    }
};

// Booking API
export const bookingAPI = {
    getBookings: async (userId, isAdmin = false) => {
        let q = collection(db, "bookings");
        if (!isAdmin && userId) {
            q = query(q, where("userId", "==", userId));
        }
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    createBooking: async (userId, bookingData) => {
        const data = { ...bookingData, userId, createdAt: new Date().toISOString() };
        const ref = await addDoc(collection(db, "bookings"), data);
        return { id: ref.id, ...data };
    },

    updateBookingStatus: async (id, status, userId) => {
        await updateDoc(doc(db, "bookings", id), { status });
        return { id, status };
    }
};

// Support API
export const supportAPI = {
    getMessages: async (userId, isAdmin = false) => {
        let q = collection(db, "messages");
        if (!isAdmin && userId) {
            q = query(q, where("userId", "==", userId));
        }
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    sendMessage: async (userId, message) => {
        const data = { userId, message, createdAt: new Date().toISOString(), answer: "" };
        const ref = await addDoc(collection(db, "messages"), data);
        return { id: ref.id, ...data };
    },

    updateMessage: async (id, userId, updates) => {
        await updateDoc(doc(db, "messages", id), updates);
    }
};

// Favourites API
export const favouritesAPI = {
    toggleFavourite: async (userId, tourId) => {
        const ref = doc(db, "users", userId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            let favs = snap.data().favourites || [];
            if (favs.includes(tourId)) {
                favs = favs.filter(id => id !== tourId);
            } else {
                favs.push(tourId);
            }
            await updateDoc(ref, { favourites: favs });
            return { favourites: favs };
        }
        return { favourites: [] };
    }
};
