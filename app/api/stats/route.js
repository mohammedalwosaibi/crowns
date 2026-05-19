// app/api/stats/route.js
import { NextResponse } from 'next/server';
import { getLeaderboardData } from '@/app/lib/riot';

export async function GET() {
    try {
        const data = await getLeaderboardData();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}