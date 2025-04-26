import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
    userId: localStorage.getItem("userId"),
  });

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);

    // Make sure userId is set properly from the login response
    if (data.userId) {
      localStorage.setItem("userId", data.userId);
    }

    setAuth(data); // triggers re-render
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, username: null, role: null, userId: null });
  };

  // Make sure we expose role and userId in our context value
  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logout,
        role: auth.role,
        userId: auth.userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
