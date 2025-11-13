'use client';

import * as React from 'react';

import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { AdminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ProductInterface } from '@/utils/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function ProductsPage() {
	const [products, setProducts] = React.useState<ProductInterface[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [deleteProductId, setDeleteProductId] = React.useState<string | null>(null);
	const [isDeleting, setIsDeleting] = React.useState(false);

	const fetchProducts = async () => {
		try {
			const data = await AdminAPI.getProducts();
			setProducts(data);
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
		} finally {
			setLoading(false);
		}
	};

	React.useEffect(() => {
		fetchProducts();
	}, []);

	const handleDelete = async () => {
		if (!deleteProductId) return;
		setIsDeleting(true);
		try {
			await AdminAPI.deleteProduct(deleteProductId);
			toast.success('Product deleted successfully');
			setProducts((prev) => prev.filter((p) => p.id !== deleteProductId));
			setDeleteProductId(null);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to delete product');
		} finally {
			setIsDeleting(false);
		}
	};
	const columns: ColumnDef<ProductInterface>[] = [
		{
			accessorKey: 'title',
			header: ({ column }) => (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Title <ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => {
				const title = row.original.title;
				const truncated = title.length > 30 ? title.slice(0, 30) + '...' : title;
				if (title.length > 30) {
					return (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className='cursor-help'>{truncated}</span>
								</TooltipTrigger>
								<TooltipContent>
									<p className='max-w-xs break-words'>{title}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					);
				}
				return title;
			},
		},
		{
			accessorKey: 'slug',
			header: ({ column }) => (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Slug <ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => {
				const slug = row.original.slug;
				const truncated = slug.length > 30 ? slug.slice(0, 30) + '...' : slug;
				if (slug.length > 30) {
					return (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className='cursor-help'>{truncated}</span>
								</TooltipTrigger>
								<TooltipContent>
									<p className='max-w-xs break-words'>{slug}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					);
				}
				return slug;
			},
		},
		{
			accessorKey: 'description',
			header: ({ column }) => (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Description <ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => {
				const description = row.original.description ? row.original.description : '';
				const truncated = description.length > 50 ? description.slice(0, 50) + '...' : description;
				if (description.length > 50) {
					return (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className='cursor-help'>{truncated}</span>
								</TooltipTrigger>
								<TooltipContent>
									<p className='max-w-xs w-fit break-words'>{description}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					);
				}
				return description;
			},
		},
		{
			accessorKey: 'price',
			header: ({ column }) => (
				<div className='flex justify-center items-center'>
					<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						Price <ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				</div>
			),
			cell: ({ row }) => <div className='text-center font-medium'>${row.original.price.toFixed(2)}</div>,
		},
		{
			accessorKey: 'categoryIds',
			header: ({ column }) => (
				<div className='flex justify-center'>
					<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						Categories <ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				</div>
			),
			cell: ({ row }) => <div className='text-center'>{row.original.categoryIds?.map((c) => c.name).join(', ') || 'N/A'}</div>,
		},
		{
			accessorKey: 'stock',
			header: ({ column }) => (
				<div className='flex justify-center'>
					<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						Stock <ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				</div>
			),
			cell: ({ row }) => <div className='text-center font-medium'>{row.original.stock}</div>,
		},
		{
			accessorKey: 'rating',
			header: ({ column }) => (
				<div className='flex justify-center'>
					<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						Rating <ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				</div>
			),
			cell: ({ row }) => <div className='text-center'>{row.original.rating ?? '-'}</div>,
		},
		{
			accessorKey: 'createdAt',
			header: ({ column }) => (
				<div className='flex justify-center'>
					<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						Created At <ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				</div>
			),
			cell: ({ row }) => <div className='text-center'>{new Date(row.original.createdAt).toLocaleDateString()}</div>,
		},
		{
			accessorKey: 'updatedAt',
			header: ({ column }) => (
				<div className='flex justify-center'>
					<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						Updated At <ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				</div>
			),
			cell: ({ row }) => <div className='text-center'>{new Date(row.original.updatedAt).toLocaleDateString()}</div>,
		},
		{
			id: 'actions',
			enableHiding: false,
			header: () => <div className='text-center'>Actions</div>,
			cell: ({ row }) => {
				const product = row.original;
				return (
					<div className='flex justify-center gap-2'>
						<Link href={`/admin/products/edit/${product.id}`}>
							<Button variant='outline' size='sm'>
								Edit
							</Button>
						</Link>
						<Dialog onOpenChange={(open) => !open && setDeleteProductId(null)}>
							<DialogTrigger asChild>
								<Button variant='destructive' size='sm' onClick={() => setDeleteProductId(product.id)}>
									Delete
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Are you absolutely sure?</DialogTitle>
									<DialogDescription>This action cannot be undone. This will permanently delete the product.</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<Button variant='outline' onClick={() => setDeleteProductId(null)} disabled={isDeleting}>
										Cancel
									</Button>
									<Button variant='destructive' onClick={handleDelete} disabled={isDeleting}>
										Delete
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				);
			},
		},
	];

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
		title: true,
		price: true,
		stock: true,
		slug: false,
		description: false,
		categoryIds: false,
		rating: false,
		createdAt: false,
		updatedAt: false,
	});
	const [rowSelection] = React.useState({});

	const table = useReactTable({
		data: products,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-2xl font-bold'>Products</h1>
				<Link href='/admin/products/create'>
					<Button>Create New Product</Button>
				</Link>
			</div>

			<div className='flex items-center py-4'>
				<Input placeholder='Filter by title...' value={(table.getColumn('title')?.getFilterValue() as string) ?? ''} onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)} className='max-w-sm' />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline' className='ml-auto'>
							Columns <ChevronDown />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => (
								<DropdownMenuCheckboxItem key={column.id} className='capitalize' checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
									{column.id}
								</DropdownMenuCheckboxItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className='overflow-hidden rounded-md border'>
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
							Array.from({ length: 10 }).map((_, i) => (
								<TableRow key={i}>
									{Array.from({ length: 5 }).map((__, j) => (
										<TableCell key={j}>
											<Skeleton className='h-4 w-full' />
										</TableCell>
									))}
								</TableRow>
							))
						) : table.getRowModel().rows?.length ? (
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
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className='flex items-center justify-end space-x-2 py-4'>
				<div className='text-muted-foreground flex-1 text-sm'>{table.getFilteredRowModel().rows.length} total row(s).</div>
				<div className='space-x-2'>
					<Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
						Previous
					</Button>
					<Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
