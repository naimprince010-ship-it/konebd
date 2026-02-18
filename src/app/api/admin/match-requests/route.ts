import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MatchRequest from '@/models/MatchRequest';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        // Return latest first
        const requests = await MatchRequest.find({}).sort({ submittedAt: -1 });
        return NextResponse.json(requests);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch match requests' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const { id, status } = await request.json();

        if (!['pending', 'contacted', 'resolved'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const matchRequest = await MatchRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!matchRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        return NextResponse.json({ message: `Request updated`, matchRequest });

    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
