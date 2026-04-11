import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession, rolData } from "@/lib/supabaseProxy"

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const { supabase } = updateSession(req)
    const { data: { user } } = await supabase.auth.getUser()

    // Si no hay usuario autenticado, redirigir al origen para rutas protegidas
    if (!user) {
        if (pathname.startsWith('/admin') ||
            pathname.startsWith('/cobrador') ||
            pathname.startsWith('/agente') ||
            pathname.startsWith('/dashboard') ||
            pathname.startsWith('/reportes') ||
            pathname.startsWith('/perfil') ||
            pathname.startsWith('/sistema') ||
            pathname.startsWith('/recarga') ||
            (pathname.startsWith('/rutas') && pathname !== '/rutas')) {
            return NextResponse.redirect(new URL('/', req.url))
        }
        return NextResponse.next()
    }

    const idUser = user.id
    let rol = null
    let rolTienePrmiso = false

    try {
        const rolDataResult = await rolData(idUser, req)
        rol = rolDataResult.rol
        rolTienePrmiso = rolDataResult.rolTienePrmiso
    } catch (error) {
        console.error("Error obteniendo datos del rol:", error)
        // Si hay error obteniendo el rol, redirigir al origen
        return NextResponse.redirect(new URL('/', req.url))
    }

    // Rutas de administrador
    if (pathname.startsWith('/admin') && (!['administrador'].includes(rol || '') || !rolTienePrmiso)) {
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

    // Rutas que requieren autenticación (cualquier rol)
    if ((pathname.startsWith('/recarga') || (pathname.startsWith('/rutas') && pathname !== '/rutas')) && (!rol || !rolTienePrmiso)) {
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
        '/sistema/:path*',
        '/recarga/:path*',
        '/rutas/:path*'
    ]
}
