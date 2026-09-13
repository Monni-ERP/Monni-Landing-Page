# Monni — Agencia de Software y Desarrollo Web

Sitio web oficial desarrollado con **Astro 5**, CSS moderno y animaciones avanzadas con **GSAP** y **Lenis Smooth Scroll**.

## 🚀 Comandos con pnpm

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build

# Previsualizar el build de producción
pnpm preview
```

## 📁 Arquitectura del Proyecto

```
Landingpage/
├── public/
│   ├── assets/
│   │   ├── logo.png           # Isotipo oficial sin fondo (transparente)
│   │   ├── logo-sm.png        # Versión optimizada / favicon
│   │   └── mascot-hero.jpg
│   └── main.js                # Orquestador GSAP, ScrollTrigger, Lenis y efectos
├── src/
│   ├── components/
│   │   ├── Navbar.astro       # Header fijo con backdrop blur y menú mobile
│   │   ├── Hero.astro         # Hero con animación, mascota e indicadores
│   │   ├── Marquee.astro      # Ticker infinito del stack tecnológico
│   │   ├── Services.astro     # Bento grid interactivo de 4 cuadrantes
│   │   ├── Portfolio.astro    # Tarjetas con mocks interactivos y métricas
│   │   ├── Process.astro      # Timeline interactivo de 4 pasos
│   │   ├── Stack.astro        # Categorías tecnológicas y tarjetas de garantía
│   │   ├── CTA.astro          # Formulario con validación y botón de WhatsApp
│   │   └── Footer.astro       # Pie de página con enlaces corporativos
│   ├── layouts/
│   │   └── Layout.astro       # Plantilla base HTML, SEO, fuentes y scripts
│   ├── pages/
│   │   └── index.astro        # Página principal
│   └── styles/
│       └── global.css         # Sistema de diseño, tokens y estilos
├── astro.config.mjs
└── package.json
```

## 🎨 Características Implementadas

- **Logo Oficial:** Recortado y sin fondo blanco (PNG con transparencia completa).
- **Animaciones GSAP:** ScrollTrigger en títulos, contadores numéricos y word reveals.
- **Efectos 3D:** Tilt dinámico al pasar el mouse por las tarjetas del bento y portafolio.
- **Botones Magnéticos:** Cursor magnético interactivo en CTAs.
