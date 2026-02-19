import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { mobile, password, confirmPassword, securityQuestion, securityAnswer } = await request.json();

        // 1. Validation
        if (!mobile || !password || !securityQuestion || !securityAnswer) {
            return NextResponse.json({ error: 'Please provide all fields' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
        }

        // 2. Check existing user
        const existingUser = await Profile.findOne({ mobile });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists with this mobile number' }, { status: 400 });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create User (Profile)
        // Generate a sequential ID like K-1, K-2...
        const Counter = (await import('@/models/Counter')).default;

        const counter = await Counter.findOneAndUpdate(
            { id: 'profileId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const generatedId = `K-${counter.seq}`;

        const newProfile = await Profile.create({
            id: generatedId,
            mobile,
            password: hashedPassword,
            securityQuestion,
            securityAnswer: securityAnswer.toLowerCase(), // Store lowercase for easy matching
        });

        // 5. Response (exclude password)
        return NextResponse.json({
            message: 'User registered successfully',
            user: {
                id: newProfile.id,
                mobile: newProfile.mobile,
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
    }
}
