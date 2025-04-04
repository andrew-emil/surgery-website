import {
	useContext,
	useState,
	createContext,
	useCallback,
	useEffect,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

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
	const [user, setUser] = useState(null);
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
				sameSite: "Lax",
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

	useEffect(() => {
		const token = Cookies.get("ACCESS_TOKEN");
		if (token) {
			try {
				const decodedUser = jwtDecode(token);
				setUser(decodedUser);
			} catch (err) {
				console.error("Token decode error:", err);
			}
		}
	}, []); // Run once on mount

	return (
		<StateContext.Provider
			value={{
				user,
				token,
				settings,
				setUser,
				setToken,
				setSettings,
			}}>
			{children}
		</StateContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStateContext = () => useContext(StateContext);
