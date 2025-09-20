'use client';

import * as React from 'react';

import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { AdminAPI } from '@/lib/api';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryInterface } from '@/utils/types/types';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function CategoriesPage() {
	const [categories, setCategories] = React.useState<CategoryInterface[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [deleteCategoryId, setDeleteCategoryId] = React.useState<string | null>(null);
	const [deleting, setDeleting] = React.useState(false); // <-- NEW

	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const fetchCategories = async () => {
		try {
			const data = await AdminAPI.getCategories();
			setCategories(data);
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
		} finally {
			setLoading(false);
		}
	};
	React.useEffect(() => {
		fetchCategories();
	}, []);
	const handleDelete = async () => {
		if (!deleteCategoryId) return;
		setDeleting(true);
		try {
			await AdminAPI.deleteCategory(deleteCategoryId);
			toast.success('Category deleted successfully');
			setDeleteCategoryId(null);
			fetchCategories();
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
		} finally {
			setDeleting(false);
		}
	};
	const columns: ColumnDef<CategoryInterface>[] = [
		{
			accessorKey: 'image',
			header: 'Image',
			cell: ({ row }) => (row.original.image ? <Image src={row.original.image.url} alt={row.original.name} width={40} height={40} className='mx-auto rounded-md object-cover' /> : <div className='w-10 h-10 bg-gray-200 rounded-md mx-auto' />),
		},
		{
			accessorKey: 'name',
			header: ({ column }) => (
				<Button variant='ghost' className='flex items-center mx-auto' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Name <ArrowUpDown className='ml-1 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => <div className='text-center'>{row.original.name}</div>,
		},
		{
			accessorKey: 'slug',
			header: ({ column }) => (
				<Button variant='ghost' className='flex items-center mx-auto' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Slug <ArrowUpDown className='ml-1 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => <div className='text-center'>{row.original.slug}</div>,
		},
		{
			accessorKey: 'parentId',
			header: ({ column }) => (
				<Button variant='ghost' className='flex items-center mx-auto' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Parent <ArrowUpDown className='ml-1 h-4 w-4' />
				</Button>
			),
			cell: ({ row }) => <div className='text-center'>{row.original.parentId ? row.original.parentId.name : 'N/A'}</div>,
		},
		{
			id: 'actions',
			header: () => <div className='text-center'>Actions</div>,
			cell: ({ row }) => {
				const category = row.original;
				return (
					<div className='flex justify-center gap-2'>
						<Link href={`/admin/categories/edit/${category.id}`}>
							<Button variant='outline' size='sm'>
								Edit
							</Button>
						</Link>
						<Dialog onOpenChange={(open) => !open && setDeleteCategoryId(null)}>
							<DialogTrigger asChild>
								<Button variant='destructive' size='sm' onClick={() => setDeleteCategoryId(category.id)}>
									Delete
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Are you absolutely sure?</DialogTitle>
									<DialogDescription>This action cannot be undone. This will permanently delete the category.</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<Button variant='outline' onClick={() => setDeleteCategoryId(null)} disabled={deleting}>
										Cancel
									</Button>
									<Button variant='destructive' onClick={handleDelete} disabled={deleting}>
										{deleting ? 'Deleting...' : 'Delete'}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data: categories,
		columns,
		state: { columnFilters, sorting },
		onColumnFiltersChange: setColumnFilters,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-2xl font-bold'>Categories</h1>
				<Link href='/admin/categories/create'>
					<Button>Create New Category</Button>
				</Link>
			</div>

			<div className='mb-4'>
				<Input placeholder='Search by name...' value={(table.getColumn('name')?.getFilterValue() as string) ?? ''} onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)} className='max-w-sm' />
			</div>

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
								{Array.from({ length: columns.length }).map((__, j) => (
									<TableCell key={j} className='text-center'>
										<Skeleton className={j === 0 ? 'h-10 w-10 rounded-md mx-auto' : 'h-4 w-24 mx-auto'} />
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
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
