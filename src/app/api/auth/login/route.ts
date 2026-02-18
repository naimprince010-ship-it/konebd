import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { mobile, password } = await request.json();

        if (!mobile || !password) {
            return NextResponse.json({ error: 'Please provide mobile and password' }, { status: 400 });
        }

        // Include password field which is select: false by default
        const user = await Profile.findOne({ mobile }).select('+password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.id,
                mobile: user.mobile,
                isAdmin: false // Can add role later
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
    }
}
