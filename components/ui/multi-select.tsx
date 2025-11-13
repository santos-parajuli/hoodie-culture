'use client';

import * as React from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Option {
	label: string;
	value: string;
}

interface MultiSelectProps {
	options: Option[];
	value: string[];
	onChange: (value: string[]) => void;
	placeholder?: string;
}

export function MultiSelect({ options, value, onChange, placeholder }: MultiSelectProps) {
	const [open, setOpen] = React.useState(false);

	const toggleValue = (val: string) => {
		if (value.includes(val)) {
			onChange(value.filter((v) => v !== val));
		} else {
			onChange([...value, val]);
		}
	};

	return (
		<div className='w-full'>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
						<span className='truncate'>
							{value.length === 0 && (placeholder || 'Select categories')}
							{value.length === 1 && options.find((opt) => opt.value === value[0])?.label}
							{value.length === 2 && value.map((v) => options.find((opt) => opt.value === v)?.label).join(', ')}
							{value.length > 2 && `${value.length} selected`}
						</span>
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-full p-0'>
					<Command>
						<CommandInput placeholder='Search categories...' />
						<CommandList>
							<CommandGroup>
								{options.map((opt) => {
									const isActive = value.includes(opt.value);
									return (
										<CommandItem key={opt.value} value={opt.value} onSelect={() => toggleValue(opt.value)}>
											<Check className={cn('mr-2 h-4 w-4', isActive ? 'opacity-100' : 'opacity-0')} />
											{opt.label}
										</CommandItem>
									);
								})}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			{value.length > 0 && (
				<div className='mt-2 flex flex-wrap gap-2'>
					{value.map((val) => {
						const label = options.find((opt) => opt.value === val)?.label;
						return (
							<Badge key={val} variant='secondary' className='px-2 py-1 text-sm'>
								{label}
							</Badge>
						);
					})}
				</div>
			)}
		</div>
	);
}
