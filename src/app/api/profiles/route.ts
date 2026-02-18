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

        // Generate ID if not present
        if (!body.id) {
            body.id = `K-${Date.now()}`;
        }

        const profile = await Profile.create(body);
        return NextResponse.json(profile, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
    }
}
