'use client';

import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

import { getInitials } from '@/utils/helpers/getInitials';

export default function UserAvatar({ name, email }: { name?: string | null; email?: string | null }) {
	const initials = getInitials({ name, email });

	return (
		<Avatar>
			<AvatarFallback>{initials}</AvatarFallback>
		</Avatar>
	);
}
