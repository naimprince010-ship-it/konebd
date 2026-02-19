import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const profiles = await Profile.find({}).sort({ createdAt: -1 });
        return NextResponse.json(profiles);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Handle ID: Use provided or generate sequential
        if (!body.id) {
            const Counter = (await import('@/models/Counter')).default;
            const counter = await Counter.findOneAndUpdate(
                { id: 'profileId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            body.id = `K-${counter.seq}`;
        }

        // Handle Missing Auth Fields (for Admin Created Profiles)
        if (!body.mobile) {
            body.mobile = `dummy_${body.id}_${Date.now()}`; // Ensure uniqueness
            body.password = '$2a$10$dummyHashValueForAdminCreatedProfiles'; // Dummy hash
            body.securityQuestion = 'admin_created';
            body.securityAnswer = 'admin_created';
        }

        const profile = await Profile.create(body);
        return NextResponse.json(profile, { status: 201 });
    } catch (error: any) {
        console.error("Profile Create Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to save profile' }, { status: 500 });
    }
}
