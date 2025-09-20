import { NextRequest, NextResponse } from 'next/server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { public_id, public_ids } = body;
		if (!public_id && (!public_ids || !public_ids.length)) {
			return NextResponse.json({ message: 'public_id or public_ids required' }, { status: 400 });
		}
		let result;
		console.log(public_id, public_ids);
		if (public_ids && public_ids.length > 0) {
			result = await cloudinary.api.delete_resources(public_ids);
		} else if (public_id) {
			result = await cloudinary.uploader.destroy(public_id);
		}
		return NextResponse.json(result);
	} catch (error) {
		console.error('Cloudinary deletion error:', error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
