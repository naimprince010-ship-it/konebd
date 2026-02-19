import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MatchRequest from '@/models/MatchRequest';
import SharedLink from '@/models/SharedLink';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { selectedProfileIds, userMobile, sharedLinkToken } = await request.json();

        if (!selectedProfileIds || !Array.isArray(selectedProfileIds) || selectedProfileIds.length === 0) {
            return NextResponse.json({ error: 'No profiles selected' }, { status: 400 });
        }

        if (!userMobile || !sharedLinkToken) {
            return NextResponse.json({ error: 'Mobile and Token are required' }, { status: 400 });
        }

        // Validate Token
        const link = await SharedLink.findOne({ token: sharedLinkToken });
        if (!link) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
        }

        // create match request
        const matchRequest = await MatchRequest.create({
            userMobile,
            selectedProfileIds,
            status: 'pending'
        });

        return NextResponse.json({
            message: 'Match request submitted successfully',
            matchRequest
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Submission failed' }, { status: 500 });
    }
}
