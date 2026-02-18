import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Payment from '@/models/Payment';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { userMobile, bkashNumber, trxId, amount } = await request.json();

        if (!userMobile || !bkashNumber || !trxId || !amount) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Check if TrxID already exists
        const existingPayment = await Payment.findOne({ trxId });
        if (existingPayment) {
            return NextResponse.json({ error: 'Transaction ID already submitted' }, { status: 400 });
        }

        const newPayment = await Payment.create({
            userMobile,
            bkashNumber,
            trxId,
            amount,
            status: 'pending'
        });

        return NextResponse.json({
            message: 'Payment submitted successfully',
            payment: newPayment
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Submission failed' }, { status: 500 });
    }
}
