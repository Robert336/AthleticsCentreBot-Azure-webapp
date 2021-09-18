import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../api/firebase';
import { setDoc, doc, } from '@firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,

} from '@firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    function signup(email, password) {

        return createUserWithEmailAndPassword(auth, email, password)
            .then(cred => {
                return setDoc(doc(db, "users", cred.user.uid), { beta: true })
            });
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    function updateEmail(email) {
        return updateEmail(auth.currentUser, email);
    }

    function updatePassword(password) {
        return updatePassword(auth.currentUser, password);
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoading(false);
            setCurrentUser(user);
        });
        return unsubscribe;
    }, []);


    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,

    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}