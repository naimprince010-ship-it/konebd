import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await dbConnect();

        // Dummy password hash
        const hashedPassword = await bcrypt.hash('123456', 10);

        const dummyProfiles = [
            {
                id: 'K-201',
                mobile: '01700000001',
                password: hashedPassword,
                securityQuestion: 'school',
                securityAnswer: 'dhaka',
                age: 22,
                height: "5'2\"",
                education: "HSC",
                district: "Dhaka",
                image: "/profile-images/1.jpg",
                isPremium: false
            },
            {
                id: 'K-202',
                mobile: '01700000002',
                password: hashedPassword,
                securityQuestion: 'school',
                securityAnswer: 'dhaka',
                age: 24,
                height: "5'4\"",
                education: "BSc in CSE",
                district: "Chittagong",
                image: "/profile-images/2.jpg",
                isPremium: false
            },
            {
                id: 'K-203',
                mobile: '01700000003',
                password: hashedPassword,
                securityQuestion: 'school',
                securityAnswer: 'dhaka',
                age: 23,
                height: "5'3\"",
                education: "Honours",
                district: "Rajshahi",
                image: "/profile-images/3.jpg",
                isPremium: false
            },
            {
                id: 'K-204',
                mobile: '01700000004',
                password: hashedPassword,
                securityQuestion: 'school',
                securityAnswer: 'dhaka',
                age: 21,
                height: "5'1\"",
                education: "Diploma",
                district: "Sylhet",
                image: "/profile-images/4.jpg",
                isPremium: false
            },
            {
                id: 'K-205',
                mobile: '01700000005',
                password: hashedPassword,
                securityQuestion: 'school',
                securityAnswer: 'dhaka',
                age: 25,
                height: "5'5\"",
                education: "Masters",
                district: "Khulna",
                image: "/profile-images/5.jpg",
                isPremium: false
            }
        ];

        // Check if profiles already exist to avoid duplicates (optional, or just insert)
        // For now, just insert.
        await Profile.insertMany(dummyProfiles);

        return NextResponse.json({ message: 'Profiles seeded successfully', count: dummyProfiles.length });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
