'use client';

import * as React from 'react';

import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { OrderInterface } from '@/utils/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/utils/helpers/formatPrice';
import { toast } from 'sonner';

export default function OrdersPage() {
	const [orders, setOrders] = React.useState<OrderInterface[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [statusFilter, setStatusFilter] = React.useState<string>('all');

	const fetchOrders = async () => {
		try {
			const res = await fetch('/api/admin/orders');
			if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
			const data = await res.json();
			setOrders(data);
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
			setError(err instanceof Error ? err.message : 'An unknown error occurred');
		} finally {
			setLoading(false);
		}
	};

	React.useEffect(() => {
		fetchOrders();
	}, []);

	const handleStatusChange = async (orderId: string, newStatus: OrderInterface['status']) => {
		try {
			const res = await fetch(`/api/admin/orders/${orderId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus }),
			});
			if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
			toast.success('Order status updated successfully');
			fetchOrders();
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
		}
	};

	// Filter orders by status
	const filteredOrders = React.useMemo(() => {
		return statusFilter === 'all' ? orders : orders.filter((order) => order.status === statusFilter);
	}, [orders, statusFilter]);

	const columns: ColumnDef<OrderInterface>[] = [
		{
			accessorKey: 'id',
			header: ({ column }) => (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='flex items-center mx-auto'>
					Order ID <ArrowUpDown className='ml-1 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => (
				<Link href={`/admin/orders/${row.original.id}`} className='text-blue-600 hover:underline'>
					{row.original.id}
				</Link>
			),
		},
		{
			accessorKey: 'userId',
			header: ({ column }) => (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='flex items-center mx-auto'>
					Customer <ArrowUpDown className='ml-1 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => `${row.original.userId.name} (${row.original.userId.email})`,
			filterFn: (row, id, value: string) => {
				const { name, email } = row.getValue<{ name: string; email: string }>(id);
				return name.toLowerCase().includes(value.toLowerCase()) || email.toLowerCase().includes(value.toLowerCase());
			},
		},
		{
			accessorKey: 'total',
			header: ({ column }) => (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='flex items-center mx-auto'>
					Total <ArrowUpDown className='ml-1 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => formatPrice(row.original.total),
		},
		{
			accessorKey: 'status',
			header: ({ column }) => (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='flex items-center mx-auto'>
					Status <ArrowUpDown className='ml-1 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => (
				<Select value={row.original.status} onValueChange={(val: OrderInterface['status']) => handleStatusChange(row.original.id, val)}>
					<SelectTrigger className='w-[120px]'>
						<SelectValue placeholder={row.original.status} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='pending'>Pending</SelectItem>
						<SelectItem value='paid'>Paid</SelectItem>
						<SelectItem value='shipped'>Shipped</SelectItem>
						<SelectItem value='completed'>Completed</SelectItem>
						<SelectItem value='cancelled'>Cancelled</SelectItem>
					</SelectContent>
				</Select>
			),
		},
		{
			accessorKey: 'createdAt',
			header: ({ column }) => (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='flex items-center mx-auto'>
					Date <ArrowUpDown className='ml-1 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
		},
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => (
				<Link href={`/admin/orders/${row.original.id}`}>
					<Button variant='outline' size='sm'>
						View Details
					</Button>
				</Link>
			),
		},
	];

	const table = useReactTable({
		data: filteredOrders,
		columns,
		state: { columnFilters, sorting },
		onColumnFiltersChange: setColumnFilters,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	if (error) return <div>Error: {error}</div>;

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Orders</h1>

			{/* Filters */}
			<div className='mb-4 flex items-center justify-between gap-4'>
				<Input placeholder='Search by Customer name or email...' value={(table.getColumn('userId')?.getFilterValue() as string) ?? ''} onChange={(e) => table.getColumn('userId')?.setFilterValue(e.target.value)} className='max-w-sm' />
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className='w-[150px]'>
						<SelectValue placeholder='Filter by Status' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All</SelectItem>
						<SelectItem value='pending'>Pending</SelectItem>
						<SelectItem value='paid'>Paid</SelectItem>
						<SelectItem value='shipped'>Shipped</SelectItem>
						<SelectItem value='completed'>Completed</SelectItem>
						<SelectItem value='cancelled'>Cancelled</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Table */}
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
					{loading ? (
						Array.from({ length: 5 }).map((_, idx) => (
							<TableRow key={idx}>
								{columns.map((_, j) => (
									<TableCell key={j} className='text-center'>
										<Skeleton className={j === 0 ? 'h-6 w-20 mx-auto' : 'h-4 w-24 mx-auto'} />
									</TableCell>
								))}
							</TableRow>
						))
					) : table.getRowModel().rows.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className='text-center'>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
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
