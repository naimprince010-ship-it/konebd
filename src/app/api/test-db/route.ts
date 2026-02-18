import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({
            status: 'success',
            message: 'MongoDB connection established successfully!'
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to connect to MongoDB',
            error: error.message
        }, { status: 500 });
    }
}
