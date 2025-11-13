'use client';

import { AdminAPI } from '@/lib/api';
import { Customer } from '@/utils/types/types';
import CustomersClient from '@/components/admin/pages/customers-client';
import React from 'react';
import { toast } from 'sonner';

export default function CustomersPage() {
	const [user, setUser] = React.useState<Customer[]>([]);

	const fetchCategories = async () => {
		try {
			const data = await AdminAPI.getCustomers();
			setUser(data);
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
		}
	};
	React.useEffect(() => {
		fetchCategories();
	}, []);
	return (
		<div className='container mx-auto p-4 md:p-8'>
			<div className='mb-6'>
				<h1 className='text-3xl font-bold'>Customers</h1>
				<p className='text-muted-foreground'>Manage your customers and view their order history.</p>
			</div>
			<CustomersClient customers={user} />
		</div>
	);
}
