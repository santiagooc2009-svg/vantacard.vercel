# VantaCard

Tarjetas de presentación digitales NFC. El sitio vive en la carpeta
`vantacard-web/` en las ramas de trabajo — ver los Pull Requests para
el contenido.

## Despliegue en Vercel

Este repositorio se despliega en Vercel como sitio estático. `vercel.json`
en la raíz hace tres cosas:

- **`buildCommand`** — copia `vantacard-web/` a `dist/`. Sin este paso
  Vercel sirve la raíz del repositorio, donde no hay `index.html`, y el
  sitio responde 404: `outputDirectory` por sí solo no basta cuando el
  proyecto no tiene un build propio.
- **`outputDirectory: "dist"`** — lo que se publica como raíz del dominio.
  `dist/` se regenera en cada deploy y está en `.gitignore`.
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
