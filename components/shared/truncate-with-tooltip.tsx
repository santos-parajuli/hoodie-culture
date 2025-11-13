'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TruncateWithTooltipProps {
	text: string;
	maxLength?: number; // default 30
}

export function TruncateWithTooltip({ text, maxLength = 30 }: TruncateWithTooltipProps) {
	if (!text) return null;

	const truncated = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

	if (text.length <= maxLength) {
		return <span>{text}</span>;
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<span className='cursor-help'>{truncated}</span>
				</TooltipTrigger>
				<TooltipContent>
					<p className='max-w-xs break-words'>{text}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
