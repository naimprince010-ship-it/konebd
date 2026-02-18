import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { mobile } = await request.json();

        if (!mobile) {
            return NextResponse.json({ error: 'Mobile number required' }, { status: 400 });
        }

        const user = await Profile.findOne({ mobile });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            isPremium: user.isPremium || false
        });

    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
    }
}
