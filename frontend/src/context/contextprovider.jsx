import {
	useContext,
	useState,
	createContext,
	useCallback,
	useEffect,
} from "react";
import Cookies from "js-cookie";
import { io } from "socket.io-client";

const StateContext = createContext({
	user: null,
	token: null,
	settings: { theme: "light", language: "en" },
	socket: null,
	setUser: () => {},
	setToken: () => {},
	setSettings: () => {},
});

// eslint-disable-next-line react/prop-types
export const ContextProvider = ({ children }) => {
	const [user, _setUser] = useState(() => {
		const cookieValue = Cookies.get("USER");
		try {
			return cookieValue ? JSON.parse(cookieValue) : null;
		} catch (err) {
			console.error("Failed to parse user cookie", err);
			return null;
		}
	});
	const [token, _setToken] = useState(Cookies.get("ACCESS_TOKEN") || null);
	const [settings, _setSettings] = useState(() => {
		const savedSettings = localStorage.getItem("user_settings");
		return savedSettings
			? JSON.parse(savedSettings)
			: { theme: "light", language: "en" };
	});
	const [socket, setSocket] = useState(null);

	const setUser = (user) => {
		_setUser(user);
		if (user) {
			Cookies.set("USER", JSON.stringify(user), {
				expires: 30,
				secure: false,
				path: "/",
			});
		} else {
			Cookies.remove("USER");
		}
	};

	const setToken = (token) => {
		_setToken(token);
		if (token) {
			Cookies.set("ACCESS_TOKEN", token, {
				expires: 30,
				secure: false,
				sameSite: "Lax",
				path: "/",
			});
		} else {
			Cookies.remove("ACCESS_TOKEN");
		}
	};

	const setSettings = useCallback((newSettings) => {
		if (typeof newSettings === "string") {
			newSettings = { theme: newSettings };
		}

		_setSettings((prev) => {
			const updatedSettings = { ...prev, ...newSettings };
			localStorage.setItem("user_settings", JSON.stringify(updatedSettings));
			return updatedSettings;
		});
	}, []);

	const SOCKET_URL = "http://localhost:4000";

	useEffect(() => {
		let newSocket;

		if (token && !socket) {
			const setupSocket = () => {
				const socketInstance = io(SOCKET_URL, {
					withCredentials: true,
					autoConnect: true,
				});

				socketInstance.on("connect", () => {
					
					setSocket(socketInstance);
				});

				socketInstance.on("disconnect", (reason) => {
					
					if (reason === "io server disconnect") {
						setTimeout(() => socketInstance.connect(), 1000);
					}
				});

				socketInstance.on("connect_error", (err) => {
					console.error("Connection error:", err.message);
				});

				return socketInstance;
			};

			newSocket = setupSocket();
		}

		return () => {
			if (newSocket) {
				
				newSocket.off("connect");
				newSocket.off("disconnect");
				newSocket.off("connect_error");
				newSocket.disconnect();
			}
		};
	}, [token, socket]);

	return (
		<StateContext.Provider
			value={{
				user,
				token,
				settings,
				socket,
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
