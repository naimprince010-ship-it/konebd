import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { mobile, securityAnswer, newPassword } = await request.json();

        if (!mobile || !securityAnswer || !newPassword) {
            return NextResponse.json({ error: 'Please provide all fields' }, { status: 400 });
        }

        // Select securityAnswer to check
        const user = await Profile.findOne({ mobile }).select('+securityAnswer');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check security answer (case insensitive simple check)
        if (user.securityAnswer.toLowerCase() !== securityAnswer.toLowerCase()) {
            return NextResponse.json({ error: 'Incorrect security answer' }, { status: 400 });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        return NextResponse.json({ message: 'Password reset successful' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Reset failed' }, { status: 500 });
    }
}
