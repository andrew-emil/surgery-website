/**
 * Extracts the error message for a specific field from actionData, supporting various error shapes.
 * @param {object} actionData - The action data object, possibly containing an error property.
 * @param {string} field - The field name to extract the error for.
 * @returns {string|undefined} The error message for the field, or undefined if not found.
 */
export function getFieldError(actionData, field) {
	if (!actionData || !actionData.error) return undefined;
	const error = actionData.error;

	if (typeof error === "object" && !Array.isArray(error)) {
		return error[field];
	}

	if (Array.isArray(error)) {
		const found = error.find(
			(errObj) => errObj && typeof errObj === "object" && field in errObj
		);
		return found ? found[field] : undefined;
	}

	if (typeof error === "string") {
		if (!field || field === "general") return error;
	}

	return undefined;
}
