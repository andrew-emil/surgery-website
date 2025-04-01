import { useContext, useState, createContext } from "react";
import Cookies from "js-cookie";

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
	const [user, setUser] = useState();
	const [message, setMessage] = useState();
	const [token, _setToken] = useState(Cookies.get("ACCESS_TOKEN") || null);

	const setToken = (token) => {
		_setToken(token);
		if (token) {
			Cookies.set("ACCESS_TOKEN", token, {
				expires: 7,
				secure: false, //only for production == true
				sameSite: "Strict",
			});
		} else {
			Cookies.remove("ACCESS_TOKEN");
		}
		console.log(token);
	};

	return (
		<StateContext.Provider
			value={{ user, token, message, setUser, setToken, setMessage }}>
			{children}
		</StateContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStateContext = () => useContext(StateContext);
