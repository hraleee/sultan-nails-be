// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//     return proxyRequest(request);
// }
// // export async function POST(request: NextRequest) {
// //     return proxyRequest(request);
// // }

// // async function proxyRequest(req: NextRequest) {
// //     const beBase = 'https://sultan-nails-be.pxxl.click/api';  // ← Sostituisci con tua URL BE
// //     const path = req.nextUrl.pathname.replace('/api/proxy', '') + req.nextUrl.search;
// //     const beUrl = new URL(beBase + path);

// //     const resp = await fetch(beUrl, {
// //         method: req.method,
// //         headers: req.headers as any,
// //         body: req.body,
// //     });

// //     const response = new NextResponse(resp.body, { status: resp.status, headers: resp.headers });
// //     response.headers.set('Access-Control-Allow-Origin', '*');
// //     return response;
// // }


import { NextRequest, NextResponse } from 'next/server';

const BE_URL = process.env.BE_URL || 'https://sultan-nails-be.pxxl.click/api';  // ← URL ESATTA qui!

async function proxyRequest(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const path = url.pathname.replace('/api/proxy', '') + url.search;
        const targetUrl = `${BE_URL}${path}`;

        console.log(`Proxying ${req.method} ${targetUrl}`);  // Log per debug

        const headers = new Headers(req.headers);
        headers.delete('host');  // Fix headers

        const response = await fetch(targetUrl, {
            method: req.method,
            headers: Object.fromEntries(headers.entries()) as any,
            body: req.body,
        });

        const data = await response.arrayBuffer();  // Fix decoding

        const res = new NextResponse(data, {
            status: response.status,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            },
        });

        return res;
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Proxy failed', details: error }, { status: 500 });
    }
}

export const runtime = 'nodejs';  // Importante per fetch

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = () => new NextResponse(null, { status: 200 });

