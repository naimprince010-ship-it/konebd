import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Payment from '@/models/Payment';
import Profile from '@/models/Profile';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        // Return latest first
        const payments = await Payment.find({}).sort({ date: -1 });
        return NextResponse.json(payments);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const { id, status } = await request.json();

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const payment = await Payment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // If approved, upgrade user OR unlock shared link
        if (status === 'approved') {
            if (payment.sharedLinkToken) {
                // Unlock Shared Link
                const link = await import('@/models/SharedLink').then(mod => mod.default.findOneAndUpdate(
                    { token: payment.sharedLinkToken },
                    { isPaid: true }
                ));
            } else {
                // Upgrade User Profile (Existing logic)
                await Profile.findOneAndUpdate(
                    { mobile: payment.userMobile },
                    { isPremium: true }
                );
            }
        }

        return NextResponse.json({ message: `Payment ${status}`, payment });

    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
