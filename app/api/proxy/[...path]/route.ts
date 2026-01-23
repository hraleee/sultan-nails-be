import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    return proxyRequest(request);
}
export async function POST(request: NextRequest) {
    return proxyRequest(request);
}

async function proxyRequest(req: NextRequest) {
    const beBase = 'https://sultan-nails-be.pxxl.click/api';  // ← Sostituisci con tua URL BE
    const path = req.nextUrl.pathname.replace('/api/proxy', '') + req.nextUrl.search;
    const beUrl = new URL(beBase + path);

    const resp = await fetch(beUrl, {
        method: req.method,
        headers: req.headers as any,
        body: req.body,
    });

    const response = new NextResponse(resp.body, { status: resp.status, headers: resp.headers });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
}
