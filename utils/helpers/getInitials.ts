export function getInitials(user?: { name?: string | null; email?: string | null }) {
	if (!user) return '?';

	// Prefer name
	if (user.name && user.name.trim()) {
		const parts = user.name.trim().split(/\s+/);
		if (parts.length > 1) {
			return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
		}
		return parts[0][0].toUpperCase();
	}

	// Fallback to first letter of email
	if (user.email && user.email.trim()) {
		return user.email[0].toUpperCase();
	}

	return '?';
}
