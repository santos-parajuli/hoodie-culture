import { AuthHeader } from '@/components/shared/auth/auth-header';
import { AuthLayout } from '@/components/shared/auth/auth-layout';
import LoginForm from '@/components/shared/auth/login-form';

export default function LoginPage() {
	return (
		<AuthLayout>
			<div className='flex flex-col items-center justify-center w-full max-h-screen px-4'>
				<div className='w-full max-w-sm'>
					<AuthHeader title='Login to your account' subtitle='Enter your email below to login' />
					<LoginForm />
				</div>
			</div>
		</AuthLayout>
	);
}
