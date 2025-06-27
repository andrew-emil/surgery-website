export function checkNotificationType(type) {
	let navigateString;
	switch (type) {
		case "invite":
		case "schedule_update":
		case "auth_request":
			navigateString = "/";
			break;
		case "User Registration":
			navigateString = "/admin/pending-users";
			break;
	}

	return navigateString;
}
