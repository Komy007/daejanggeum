import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'pos_requests.json');
const DATA_DIR = path.dirname(DATA_FILE);

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getRequests() {
    if (!fs.existsSync(DATA_FILE)) return [];
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function saveRequests(requests: any[]) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2));
}

export async function GET() {
    return NextResponse.json(getRequests());
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json(); // Array of PaymentRequest or a single one? Let's assume the whole array for simplicity of the mock.
        saveRequests(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update POS requests' }, { status: 500 });
    }
}
