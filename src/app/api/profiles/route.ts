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
            // Find the highest existing ID
            const lastProfile = await Profile.findOne({ id: { $regex: /^K-\d+$/ } }).sort({ createdAt: -1 }).lean();
            let nextIdNum = 1;

            if (lastProfile && lastProfile.id) {
                // Determine max ID by checking all or just trusting sort order?
                // String sort might fail for K-10 vs K-2. K-2 > K-10 in string sort?
                // Let's fetch all matching IDs and calculate max in memory for safety with small datasets.
                // Or better: Use aggregation to extract number.

                // For safety and simplicity given small scale:
                const profiles = await Profile.find({ id: { $regex: /^K-\d+$/ } }).select('id').lean();
                if (profiles.length > 0) {
                    const ids = profiles.map(p => {
                        const match = p.id.match(/^K-(\d+)$/);
                        return match ? parseInt(match[1], 10) : 0;
                    });
                    const maxId = Math.max(...ids);
                    nextIdNum = maxId + 1;
                }
            }
            body.id = `K-${nextIdNum}`;
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
