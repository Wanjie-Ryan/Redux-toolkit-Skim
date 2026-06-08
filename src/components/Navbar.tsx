// src/components/Navbar.tsx

import React from "react";
import { useAppSelector, useAppDispatch } from "../store/hook";
import { logout } from "../features/auth/authSlice";

const Navbar: React.FC = () => {
    // Reading two pieces of state from the auth slice
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        // logout() is a sync action — no API call needed.
        // It just clears state and removes from localStorage.
        // createSlice auto-generated this action creator from
        // the logout() function we wrote in reducers: {}
        dispatch(logout());
    };

    return (
        <nav style={styles.nav}>
            <span style={styles.brand}>⚡ Redux Auth App</span>

            <div style={styles.right}>
                {isAuthenticated && user ? (
                    // ── LOGGED IN STATE ──────────────────────────────
                    // useAppSelector re-renders this component the moment
                    // isAuthenticated or user changes in the store
                    <>
                        <span style={styles.greeting}>
                            👋 Welcome, <strong>{user.name}</strong>
                        </span>
                        <span style={styles.badge}>{user.email}</span>
                        <button style={styles.logoutBtn} onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    // ── LOGGED OUT STATE ─────────────────────────────
                    <span style={styles.guestText}>
                        You are not logged in
                    </span>
                )}
            </div>
        </nav>
    );
};

// Inline styles — keeping it simple so the focus stays on Redux
const styles: Record<string, React.CSSProperties> = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        backgroundColor: "#1a1a2e",
        color: "#fff",
    },
    brand: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#e94560",
    },
    right: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    greeting: {
        fontSize: "14px",
    },
    badge: {
        fontSize: "12px",
        backgroundColor: "#16213e",
        padding: "4px 10px",
        borderRadius: "20px",
        color: "#a8a8b3",
    },
    logoutBtn: {
        padding: "6px 14px",
        backgroundColor: "#e94560",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    guestText: {
        fontSize: "14px",
        color: "#a8a8b3",
    },
};

export default Navbar;