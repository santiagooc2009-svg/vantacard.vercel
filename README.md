# VantaCard

Tarjetas de presentación digitales NFC. El sitio vive en la carpeta
`vantacard-web/` en las ramas de trabajo — ver los Pull Requests para
el contenido.

## Despliegue en Vercel

Este repositorio está configurado para desplegarse en Vercel como sitio
estático. `vercel.json` en la raíz hace dos cosas:

- **`outputDirectory: "vantacard-web"`** — el sitio vive en esa subcarpeta,
  así que Vercel sirve su contenido como raíz del dominio. No hay paso de
  build: no existe `package.json` y los archivos se publican tal cual.
- **`headers`** — traduce a Vercel las reglas de `vantacard-web/_headers`
  (que Vercel no lee): las cabeceras de seguridad y el mismo caché por tipo
  de archivo — HTML siempre revalidado, fuentes `immutable` a un año,
  imágenes y JS vendorizado a una semana con revalidación en segundo plano.

`cleanUrls` queda desactivado a propósito: los enlaces internos y las URLs
canónicas apuntan a `catalogo.html` y `compromiso.html`, y activarlo las
redirigiría a rutas sin extensión.

En la configuración del proyecto en Vercel, deja **Root Directory** en la
raíz del repositorio (no en `vantacard-web`) y el framework en *Other*;
`vercel.json` se encarga del resto.

`netlify.toml` se conserva para que el sitio siga desplegable en Netlify.
