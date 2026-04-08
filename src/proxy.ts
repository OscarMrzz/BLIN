import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession, rolData } from "@/lib/supabaseProxy"

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl

    const { supabase } = updateSession(req)
    const { data: { user } } = await supabase.auth.getUser()
    const idUser = user?.id ?? ""

    const { rol, rolTienePrmiso } = await rolData(idUser, req)

    // Rutas de administrador
    if (pathname.startsWith('/admin') && (!['administrador','cobrador'].includes(rol || '') || !rolTienePrmiso)) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    // Rutas de cobrador
    if (pathname.startsWith('/cobrador') && (!['cobrador'].includes(rol || '') || !rolTienePrmiso)) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    // Rutas de agente
    if (pathname.startsWith('/agente') && (!['agente'].includes(rol || '') || !rolTienePrmiso)) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    // Rutas que requieren cualquier rol autenticado
    if (pathname.startsWith('/dashboard') && (!rol || !rolTienePrmiso)) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    // Rutas que requieren rol específico o administrador
    if (pathname.startsWith('/reportes') && (!['administrador', 'cobrador'].includes(rol || '') || !rolTienePrmiso)) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    // Rutas de perfil - cualquier usuario autenticado
    if (pathname.startsWith('/perfil') && (!rol || !rolTienePrmiso)) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    // Rutas exclusivas del administrador
    if (pathname.startsWith('/sistema') && (!['administrador'].includes(rol || '') || !rolTienePrmiso)) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/cobrador/:path*',
        '/agente/:path*',
        '/dashboard/:path*',
        '/reportes/:path*',
        '/perfil/:path*',
        '/sistema/:path*'
    ]
};