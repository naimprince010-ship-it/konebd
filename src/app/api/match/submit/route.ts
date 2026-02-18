import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MatchRequest from '@/models/MatchRequest';
import Profile from '@/models/Profile';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { mobile, selectedIds } = await request.json();

        if (!mobile || !selectedIds || selectedIds.length === 0) {
            return NextResponse.json({ error: 'Mobile number and selected IDs are required' }, { status: 400 });
        }

        // Verify user exists
        const user = await Profile.findOne({ mobile });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const newRequest = await MatchRequest.create({
            userMobile: mobile,
            selectedProfileIds: selectedIds,
        });

        return NextResponse.json({
            message: 'Request submitted successfully',
            request: newRequest
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Submission failed' }, { status: 500 });
    }
}
