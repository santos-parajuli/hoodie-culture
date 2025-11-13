import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getToken } from 'next-auth/jwt';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });

	if (!token || token.role !== 'admin') {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const timestamp = Math.round(new Date().getTime() / 1000);

	const signature = cloudinary.utils.api_sign_request(
		{
			timestamp,
		},
		process.env.CLOUDINARY_API_SECRET as string
	);

	return NextResponse.json({ timestamp, signature });
}
