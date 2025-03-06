import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const StateContext = createContext({
  user: null,
  token: null,
  message: null,
  setUser: () => {},
  setToken: () => {},
  setMessage: () => {},
});

// eslint-disable-next-line react/prop-types
export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState();
  // const [user, setUser] = useState({ name: "adhm", email: "adhm@example.com" });
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  // const [token, _setToken] = useState(123);

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };
  return (
    <StateContext.Provider
      value={{
        user,
        token,
        message,
        setUser,
        setToken,
        setMessage,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStateContext = () => useContext(StateContext);
