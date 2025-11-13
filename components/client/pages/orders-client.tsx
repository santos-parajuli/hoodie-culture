'use client';

import * as React from 'react';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { OrderInterface } from '@/utils/types/types';
import { TruncateWithTooltip } from '@/components/shared/truncate-with-tooltip';
import { formatPrice } from '@/utils/helpers/formatPrice';

const columns: ColumnDef<OrderInterface>[] = [
	{
		accessorKey: 'id',
		header: 'Order ID',
		cell: ({ row }) => (
			<Link href={`/order/${row.original.id}`} className='text-blue-600 hover:underline'>
				{row.original.id}
			</Link>
		),
	},
	{
		accessorKey: 'items',
		header: 'Items',
		cell: ({ row }) => (
			<ul className='list-disc list-inside'>
				{row.original.items.map((item, index) => (
					<li key={index}>
						<TruncateWithTooltip text={`${item.qty} × ${item.name || 'Product'}`} maxLength={30} />
					</li>
				))}
			</ul>
		),
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.original.status;
			let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
			if (status === 'completed') variant = 'secondary';
			if (status === 'cancelled') variant = 'destructive';
			if (status === 'pending' || status === 'shipped') variant = 'outline';

			return <Badge variant={variant}>{status}</Badge>;
		},
	},
	{
		accessorKey: 'total',
		header: 'Total',
		cell: ({ row }) => formatPrice(row.original.total),
	},
	{
		id: 'actions',
		cell: ({ row }) => (
			<Button asChild variant='outline' size='sm'>
				<Link href={`/order/${row.original.id}`}>View Details</Link>
			</Button>
		),
	},
];

export default function OrdersClient({ orders }: { orders: OrderInterface[] }) {
	const table = useReactTable({
		data: orders,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className='h-24 text-center'>
								No orders found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
