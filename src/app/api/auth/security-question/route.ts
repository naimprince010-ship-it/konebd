import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const mobile = searchParams.get('mobile');

        if (!mobile) {
            return NextResponse.json({ error: 'Please provide a mobile number' }, { status: 400 });
        }

        const user = await Profile.findOne({ mobile }).select('securityQuestion');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ securityQuestion: user.securityQuestion });

    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 });
    }
}
