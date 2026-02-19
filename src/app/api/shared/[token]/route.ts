import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SharedLink from '@/models/SharedLink';
import Profile from '@/models/Profile';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ token: string }> }) {
    try {
        const { token } = await context.params;
        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        await dbConnect();
        // Updated to params then access, but params are actually promised in recent Next.js versions.
        // However, in this version context (Next 14 app dir), params is an object.
        // But let's check validation first.

        const link = await SharedLink.findOne({ token });

        if (!link) {
            return NextResponse.json({ error: 'Invalid link' }, { status: 404 });
        }

        if (new Date() > new Date(link.expiresAt)) {
            return NextResponse.json({ error: 'Link expired' }, { status: 410 });
        }

        // Fetch profiles
        const profiles = await Profile.find({
            id: { $in: link.profileIds }
        });

        const isPaid = link.isPaid;
        const freeLimit = 2; // Number of profiles visible for free

        const processedProfiles = profiles.map((p, index) => {
            const profile = p.toObject();

            // If paid, return everything
            if (isPaid) {
                return { ...profile, isLocked: false };
            }

            // If free, first 'freeLimit' profiles are visible
            if (index < freeLimit) {
                return { ...profile, isLocked: false };
            }

            // Otherwise, lock/sanitize
            return {
                id: profile.id,
                isLocked: true,
                // Blur/hide sensitive info
                image: null, // Client should show blur or placeholder
                mobile: 'HIDDEN',
                district: 'HIDDEN',
                // Keep some basic info to tease
                age: profile.age,
                height: profile.height,
                education: profile.education,
                securityQuestion: 'HIDDEN'
            };
        });

        return NextResponse.json({
            isValid: true,
            isPaid: link.isPaid,
            expiresAt: link.expiresAt,
            profiles: processedProfiles,
            totalProfiles: profiles.length,
            freeLimit: freeLimit
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch shared data' }, { status: 500 });
    }
}
