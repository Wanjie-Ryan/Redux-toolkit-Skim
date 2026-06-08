// src/components/LoginPage.tsx

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hook";
import { loginUser } from "../features/auth/authSlice";
import { clearError } from "../features/auth/authSlice";

const LoginPage: React.FC = () => {
    // Local component state — just for the form inputs.
    // Form input values don't belong in Redux — they're
    // temporary UI state that nothing else in the app cares about.
    // Only the final submitted data goes to Redux via dispatch.
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    // Pull loading and error from the Redux store.
    // These ARE global state — the Navbar or any other
    // component could potentially react to them too.
    const { loading, error, isAuthenticated } = useAppSelector(
        (state) => state.auth
    );
    const dispatch = useAppDispatch();

    // Clear any stale error when the user starts editing the form
    useEffect(() => {
        if (error) {
            dispatch(clearError());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username, email]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // This is the moment everything connects.
        // dispatch() sends the loginUser thunk to Redux.
        // loginUser receives { username, email } as `credentials`
        // inside the async function in authSlice.ts.
        // Redux Toolkit immediately dispatches loginUser.pending,
        // runs the fetch, then dispatches fulfilled or rejected.
        dispatch(loginUser({ username: username.trim(), email: email.trim() }));
    };

    // Once login succeeds, isAuthenticated becomes true in the store.
    // We can show a success state here — or in a real app
    // you'd use React Router to navigate to a dashboard.
    if (isAuthenticated) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.successTitle}>✅ You're logged in!</h2>
                    <p style={styles.hint}>
                        Check the Navbar above — your user data is live from the store.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Login</h2>

                {/* Hint so you know what valid credentials look like */}
                <div style={styles.hintBox}>
                    <p style={styles.hintTitle}>💡 Try these credentials:</p>
                    <code style={styles.code}>Username: Bret</code>
                    <br />
                    <code style={styles.code}>Email: Sincere@april.biz</code>
                </div>

                {/* Error from the Redux store — shown when loginUser.rejected fires */}
                {error && <div style={styles.error}>❌ {error}</div>}

                <div style={styles.field}>
                    <label style={styles.label}>Username</label>
                    <input
                        style={styles.input}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. Bret"
                        disabled={loading}
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Email</label>
                    <input
                        style={styles.input}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. Sincere@april.biz"
                        disabled={loading}
                    />
                </div>

                <button
                    style={{
                        ...styles.button,
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {/* loading comes directly from the Redux store —
              it's true during loginUser.pending,
              false after fulfilled or rejected */}
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 56px)",
        backgroundColor: "#0f0f1a",
    },
    card: {
        backgroundColor: "#1a1a2e",
        padding: "36px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    },
    title: {
        color: "#fff",
        marginBottom: "24px",
        fontSize: "24px",
    },
    successTitle: {
        color: "#4ecca3",
        fontSize: "22px",
        marginBottom: "12px",
    },
    hintBox: {
        backgroundColor: "#16213e",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: "20px",
        borderLeft: "3px solid #e94560",
    },
    hintTitle: {
        color: "#a8a8b3",
        fontSize: "13px",
        marginBottom: "6px",
    },
    code: {
        color: "#4ecca3",
        fontSize: "13px",
    },
    hint: {
        color: "#a8a8b3",
        fontSize: "14px",
    },
    error: {
        backgroundColor: "#2d1b1b",
        color: "#e94560",
        padding: "10px 14px",
        borderRadius: "6px",
        marginBottom: "16px",
        fontSize: "14px",
    },
    field: {
        marginBottom: "16px",
    },
    label: {
        display: "block",
        color: "#a8a8b3",
        fontSize: "13px",
        marginBottom: "6px",
    },
    input: {
        width: "100%",
        padding: "10px 12px",
        backgroundColor: "#16213e",
        border: "1px solid #2d2d44",
        borderRadius: "6px",
        color: "#fff",
        fontSize: "14px",
        boxSizing: "border-box",
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#e94560",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "bold",
        marginTop: "8px",
    },
};

export default LoginPage;


// User clicks Login
//       │
// handleSubmit fires
//       │
// dispatch(loginUser({ username, email }))
//       │
//       ├── store sets loading: true  (pending)
//       │   → button shows "Logging in...", is disabled
//       │
//       ├── fetch runs against JSONPlaceholder
//       │
//       ├── match found → store sets user + isAuthenticated: true (fulfilled)
//       │   → component renders the "You're logged in!" screen
//       │   → Navbar re-renders showing user.name and user.email
//       │
//       └── no match → store sets error string (rejected)
//           → red error box appears under the hint