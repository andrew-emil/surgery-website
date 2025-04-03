import { useContext, useState, createContext, useCallback } from "react";
import Cookies from "js-cookie";

const StateContext = createContext({
  user: null,
  token: null,
  settings: { theme: "light", language: "en" },
  setUser: () => {},
  setToken: () => {},
  setSettings: () => {},
});

// eslint-disable-next-line react/prop-types
export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, _setToken] = useState(Cookies.get("ACCESS_TOKEN") || null);
  const [settings, _setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("user_settings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : { theme: "light", language: "en" };
  });

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      Cookies.set("ACCESS_TOKEN", token, {
        expires: 30,
        secure: false, //only for production == true
        // sameSite: "Strict",
        path: "/",
      });
    } else {
      Cookies.remove("ACCESS_TOKEN");
    }
  };

  const setSettings = useCallback((newSettings) => {
    if (typeof newSettings === "string") {
      newSettings = { theme: newSettings }; // Convert string to object
    }

    _setSettings((prev) => {
      const updatedSettings = { ...prev, ...newSettings };
      localStorage.setItem("user_settings", JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  }, []);

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        settings,
        setUser,
        setToken,
        setSettings,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStateContext = () => useContext(StateContext);
