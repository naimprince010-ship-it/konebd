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

        const user = await Profile.findOneAndUpdate(
            { mobile },
            { isPremium: true },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Membership upgraded successfully',
            user: {
                id: user.id,
                mobile: user.mobile,
                isPremium: true
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: 'Payment update failed' }, { status: 500 });
    }
}
