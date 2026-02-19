import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Payment from '@/models/Payment';
import SharedLink from '@/models/SharedLink';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { bkashNumber, trxId, amount, sharedLinkToken } = await request.json();

        if (!bkashNumber || !trxId || !amount || !sharedLinkToken) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Validate Shared Link exists
        const link = await SharedLink.findOne({ token: sharedLinkToken });
        if (!link) {
            return NextResponse.json({ error: 'Invalid shared link token' }, { status: 404 });
        }

        // Check if TrxID already exists
        const existingPayment = await Payment.findOne({ trxId });
        if (existingPayment) {
            return NextResponse.json({ error: 'Transaction ID already submitted' }, { status: 400 });
        }

        const newPayment = await Payment.create({
            userMobile: link.userMobile || 'SharedLinkUser', // Fallback if not captured
            bkashNumber,
            trxId,
            amount,
            status: 'pending',
            sharedLinkToken
        });

        return NextResponse.json({
            message: 'Payment submitted successfully',
            payment: newPayment
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Submission failed' }, { status: 500 });
    }
}
