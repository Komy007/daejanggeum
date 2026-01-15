import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'tables');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ tableId: string }> }
) {
    const { tableId } = await params;
    const filePath = path.join(DATA_DIR, `${tableId}.json`);

    try {
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ cart: [], staffCalled: false, orderSubmitted: false, isPaying: false });
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load table state' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ tableId: string }> }
) {
    const { tableId } = await params;
    const filePath = path.join(DATA_DIR, `${tableId}.json`);

    try {
        const body = await request.json();
        fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save table state' }, { status: 500 });
    }
}
