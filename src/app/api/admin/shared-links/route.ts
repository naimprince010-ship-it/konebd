import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SharedLink from '@/models/SharedLink';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const links = await SharedLink.find({}).sort({ createdAt: -1 });
        return NextResponse.json(links);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { profileIds, userMobile, daysValid } = await request.json();

        if (!profileIds || !Array.isArray(profileIds) || profileIds.length === 0) {
            return NextResponse.json({ error: 'Profile IDs are required' }, { status: 400 });
        }

        const token = nanoid(10); // Generates a 10-character unique ID
        const days = daysValid || 30; // Default 30 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);

        const link = await SharedLink.create({
            token,
            profileIds,
            userMobile,
            expiresAt,
            isPaid: false
        });

        return NextResponse.json(link, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to create link' }, { status: 500 });
    }
}
