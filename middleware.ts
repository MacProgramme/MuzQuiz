// middleware.ts
// Redirige tout le trafic vers /maintenance si MAINTENANCE_MODE=true
// Pour activer : sur Vercel → Settings → Environment Variables → MAINTENANCE_MODE = true
// Pour désactiver (site live) : passer à false ou supprimer la variable
// ⚠️ NE PAS utiliser NEXT_PUBLIC_ ici — les vars NEXT_PUBLIC sont injectées au build, pas à l'exécution dans le middleware Edge

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  // Si maintenance activée...
  if (isMaintenanceMode) {
    // ...laisser passer la page maintenance elle-même (évite la boucle infinie)
    if (request.nextUrl.pathname === '/maintenance') {
      return NextResponse.next();
    }
    // Bloquer aussi les assets statiques / API internes si tu veux (optionnel)
    // Laisser passer les fichiers statiques (_next, favicon, etc.)
    if (
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/favicon') ||
      request.nextUrl.pathname.startsWith('/logo')
    ) {
      return NextResponse.next();
    }
    // Rediriger tout le reste vers /maintenance
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
