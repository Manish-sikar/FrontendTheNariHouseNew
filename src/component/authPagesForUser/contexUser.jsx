import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";

const AuthContext = createContext();

export const AuthProviderUser = ({ children }) => {
  const [authTokenUser, setAuthTokenUserState] = useState(
    () => localStorage.getItem("authTokenUser") || null
  );
  const [userDataUser, setUserDataUserState] = useState(() => {
    const userData = localStorage.getItem("userDataUser");
    return userData ? JSON.parse(userData) : null;
  });
  const [userBalance, setUserBalanceUserState] = useState(() => {
    const userData = localStorage.getItem("userBalance");
    return userData ? JSON.parse(userData) : null;
  });

  // Set token in localStorage and state
  const setTokenUser = (token) => {
    localStorage.setItem("authTokenUser", token);
    setAuthTokenUserState(token);
    resetTimer(); // Reset the inactivity timer on token set
  };

  // Logout user: Remove token and data from localStorage and state
  const logoutUser = () => {
    localStorage.removeItem("authTokenUser");
    localStorage.removeItem("userDataUser");
    localStorage.removeItem("partnerEmail");
    localStorage.removeItem("userDelar_id");
    localStorage.removeItem("userUserStatus");
    setAuthTokenUserState(null);
    setUserDataUserState(null);
    clearTimeout(window.inactivityTimer); // Clear timer on logout
    console.log("User logged out due to inactivity");
  };

  // Set user data and store it in localStorage
  const setDataUser = (data) => {
    localStorage.setItem("userDataUser", JSON.stringify(data));
    setUserDataUserState(data);
  };

  const setuserBalance = (data) => {
    localStorage.setItem("userBalance", JSON.stringify(data));
    setUserBalanceUserState(data);
  };

  const setuserEmail = (data) => {
    localStorage.setItem("partnerEmail", JSON.stringify(data));
  };
    const setuserDelar_id = (data) => {
    localStorage.setItem("userDelar_id", JSON.stringify(data));
  };
    const setuserStatus = (data) => {
    localStorage.setItem("userUserStatus", JSON.stringify(data));
  };

  // Check if the user is authenticated
  const isAuthenticatedUser = !!authTokenUser;

  // Reset the inactivity timer
  const resetTimer = () => {
    clearTimeout(window.inactivityTimer);
    window.inactivityTimer = setTimeout(logoutUser, 15 * 60 * 1000); // 15 minutes
  };

  // Track activity (mouse, keyboard, or touch events)
  useEffect(() => {
    if (isAuthenticatedUser) {
      resetTimer();
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("touchstart", resetTimer);
    }
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [isAuthenticatedUser]);

  // Check for missing partnerEmail on auth
  useEffect(() => {
    if (isAuthenticatedUser) {
      const partnerEmail = localStorage.getItem("partnerEmail");
      if (!partnerEmail) {
        logoutUser();
      }
    }
  }, [isAuthenticatedUser]);

  const contextValue = useMemo(
    () => ({
      authTokenUser,
      setTokenUser,
      userDataUser,
      setuserBalance,
      userBalance,
      setDataUser,
      setuserEmail,
      logoutUser,
      setuserDelar_id,
      setuserStatus,
      isAuthenticatedUser,
    }),
    [authTokenUser, userDataUser, userBalance]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthUser must be used within an AuthProvider");
  }
  return context;
};
