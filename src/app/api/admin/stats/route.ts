import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'admin_stats.json');
const DEFAULT_STATS = {
    total_revenue: 4250,
    new_members: 12,
    order_count: 84,
    satisfaction: 98
};

function getStats() {
    if (!fs.existsSync(DATA_FILE)) return DEFAULT_STATS;
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return { ...DEFAULT_STATS, ...JSON.parse(data) };
    } catch (e) {
        return DEFAULT_STATS;
    }
}

function saveStats(stats: any) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(stats, null, 2));
}

export async function GET() {
    return NextResponse.json(getStats());
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json(); // Partial or full stats update
        const current = getStats();
        const updated = { ...current, ...body };
        saveStats(updated);
        return NextResponse.json({ success: true, stats: updated });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update admin stats' }, { status: 500 });
    }
}
