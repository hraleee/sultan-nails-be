import { NextRequest, NextResponse } from 'next/server';

// Configurazione Backend URL
const BE_URL_ENV = process.env.BE_URL || 'https://sultan-nails-be.pxxl.click/api';
// Rimuovi slash finale se presente per evitare doppi slash
const BE_URL = BE_URL_ENV.replace(/\/$/, '');

async function proxyRequest(req: NextRequest) {
    try {
        const url = new URL(req.url);
        // Rimuove /api/proxy dal path e mantiene la query string
        const path = url.pathname.replace('/api/proxy', '') + url.search;

        // Costruisce la target URL assicurandosi che ci sia uno slash tra BE_URL e path
        const targetUrl = `${BE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

        console.log(`[Proxy] ${req.method} -> ${targetUrl}`);

        const headers = new Headers(req.headers);
        headers.delete('host');
        // Rimuoviamo connection per evitare problemi con hop-by-hop headers
        headers.delete('connection');

        const response = await fetch(targetUrl, {
            method: req.method,
            headers: headers as any,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
            // @ts-ignore
            duplex: req.body ? 'half' : undefined,
        });

        const data = await response.arrayBuffer();

        const responseHeaders = new Headers(response.headers);
        // Rimuove header problematici
        responseHeaders.delete('content-encoding');
        responseHeaders.delete('content-length');

        // Imposta CORS
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return new NextResponse(data, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('[Proxy Error]:', error);
        return NextResponse.json({ error: 'Proxy failed', details: String(error) }, { status: 502 });
    }
}

export const runtime = 'nodejs';

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const PUT = proxyRequest;

// Gestione preflight OPTIONS
export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
