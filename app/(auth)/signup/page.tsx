import { AuthHeader } from '@/components/shared/auth/auth-header';
import { AuthLayout } from '@/components/shared/auth/auth-layout';
import SignupForm from '@/components/shared/auth/signup-form';

export default function SignupPage() {
	return (
		<AuthLayout>
			<div className='flex flex-col items-center justify-center w-full p-4 max-h-screen'>
				<div className='w-full max-w-sm'>
					<AuthHeader title='Create an account' subtitle='Enter your details below to sign up' />
					<SignupForm /> {/* Client form */}
				</div>
			</div>
		</AuthLayout>
	);
}
