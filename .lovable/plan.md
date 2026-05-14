## Objetivo

Servir **inglês UK como versão padrão** em `nathferreiradesigner.com/` e **português** em `nathferreiradesigner.com/pt`, mantendo um único SPA. Isso fortalece SEO no UK (URL canônica em inglês) e dá um link limpo para compartilhar a versão PT.

Junto, aplicar o reposicionamento SEO UK (pacotes £350–£425 para pubs, cafés, salons, studios, garages, restaurants etc.) já discutido.

## Como vai funcionar

- `/` → idioma `en` (UK English) — canonical principal
- `/pt` → idioma `pt` (Português)
- `/studio` e `/studio/pt` → painel admin (mantém comportamento atual)
- O `LanguageSwitcher` (bandeiras BR/UK) passa a **navegar entre URLs** (`/` ↔ `/pt`) em vez de só trocar state — assim cada idioma tem URL própria, indexável e compartilhável.
- Sem rotas duplicadas por página: o app continua sendo single-route com seções `home`/`about`/`contact` controladas por state interno (não muda).

## Mudanças

### 1. `src/App.tsx` — rotas com prefixo de idioma

```tsx
<Routes>
  <Route path="/" element={<Index initialLang="en" />} />
  <Route path="/pt" element={<Index initialLang="pt" />} />
  <Route path="/studio" element={<Index initialLang="en" showAdmin />} />
  <Route path="/studio/pt" element={<Index initialLang="pt" showAdmin />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### 2. `src/pages/Index.tsx`

- Aceitar prop `initialLang?: Lang` e usar como estado inicial (default `'en'`, antes era `'pt'`).
- No `useEffect` de SEO, atualizar `<link rel="canonical">` dinamicamente:
  - `en` → `https://nathferreiradesigner.com/`
  - `pt` → `https://nathferreiradesigner.com/pt`
- Manter as tags `hreflang` em `index.html` apontando para `/` (en-GB, x-default) e `/pt` (pt-BR).

### 3. `src/components/portfolio/LanguageSwitcher.tsx`

Trocar `setLang` por navegação real com `useNavigate`:
- Botão UK → `navigate('/')` (ou `/studio` se já estiver em `/studio*`)
- Botão BR → `navigate('/pt')` (ou `/studio/pt`)
- Manter visual (bandeiras circulares) intacto.

Preservar `setLang` como fallback para o `MobileLayout` que também recebe a prop.

### 4. `index.html` — UK-first + pacotes £350–£425

Mesmo conteúdo já aprovado anteriormente, com hreflang ajustados para o novo path:

- `<html lang="en-GB">`
- `<title>` (≤60): `Affordable Logo & Brand Design for UK Small Businesses`
- `<meta name="description">` (≤160): `Professional logo and visual identity packages from £350 for UK pubs, cafés, salons, gyms, garages and restaurants. Logo, palette, moodboard & Canva social templates.`
- `keywords`: `affordable logo design UK, small business branding UK, pub logo designer, café branding UK, restaurant logo design, hair salon branding, barber logo, beauty salon branding, yoga studio branding, pilates studio branding, garage logo design, burger joint branding, freelance brand designer UK, Canva social media templates, visual identity package UK`
- `geo.region` → `GB`; `geo.placename` → `United Kingdom`
- `og:locale` → `en_GB`; `og:locale:alternate` → `pt_BR`
- `hreflang`:
  - `en-GB` → `https://nathferreiradesigner.com/`
  - `pt-BR` → `https://nathferreiradesigner.com/pt`
  - `x-default` → `https://nathferreiradesigner.com/`
- `<link rel="canonical">` default `https://nathferreiradesigner.com/` (sobrescrito em runtime por rota PT).

### 5. JSON-LD em `index.html` — substituir por dois blocos

**Person** (UK English) com `knowsAbout` ampliado: `Pub Branding`, `Café Branding`, `Restaurant Branding`, `Burger Joint Branding`, `Hair Salon Branding`, `Beauty Salon Branding`, `Barber Shop Branding`, `Yoga Studio Branding`, `Pilates Studio Branding`, `Auto Repair Shop Branding`, `Small Business Logo Design`, `Visual Identity`, `Canva Social Media Templates`.

**ProfessionalService** com 2 ofertas:

```jsonc
{
  "@type": "ProfessionalService",
  "name": "Nath Ferreira — Brand Design Studio",
  "areaServed": { "@type": "Country", "name": "United Kingdom" },
  "priceRange": "££",
  "audience": {
    "@type": "BusinessAudience",
    "audienceType": "UK small business owners — pubs, cafés, restaurants, hair & beauty salons, yoga & pilates studios, garages"
  },
  "makesOffer": [
    {
      "@type": "Offer", "price": "350", "priceCurrency": "GBP",
      "itemOffered": {
        "@type": "Service",
        "name": "Essential Brand Identity",
        "description": "Logo, logo variations, colour palette and moodboard."
      }
    },
    {
      "@type": "Offer", "price": "425", "priceCurrency": "GBP",
      "itemOffered": {
        "@type": "Service",
        "name": "Brand Identity + Social Media Kit",
        "description": "Logo, variations, palette, moodboard plus Canva templates: 3 Instagram/Meta posts, 3 stories and 1 Facebook ad (1.91:1)."
      }
    }
  ]
}
```

### 6. `public/robots.txt` e `public/sitemap.xml`

- `robots.txt`: adicionar `Sitemap: https://nathferreiradesigner.com/sitemap.xml` (preserva blocos existentes).
- `sitemap.xml` (novo, estático):

```xml
<url><loc>https://nathferreiradesigner.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
<url><loc>https://nathferreiradesigner.com/pt</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
```

## Fora de escopo

- Conteúdo visível das páginas (Home/About/Contact) e `data/translations.ts` — sem mudanças.
- Modais, vídeos, painel admin, tema, `MobileHomePage.tsx`, `defaults.ts`.
- Sem `react-helmet-async` (canonical é atualizado via JS no `useEffect` que já existe).

## Risco

Baixo. Roteamento SPA já é suportado pelo Lovable hosting (fallback para `index.html`), então `/pt` funciona em refresh e deep-link sem config extra.
