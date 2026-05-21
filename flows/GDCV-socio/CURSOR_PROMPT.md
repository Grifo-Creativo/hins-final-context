# Prompt para Cursor — continuar vista GDCV Socio V2

Pegar esto al inicio de una sesión de Cursor para que tenga todo el contexto:

---

```
Estoy trabajando en el proyecto hins-final-context (Next.js 14, TypeScript, Tailwind, shadcn/ui).

Tenemos una vista nueva en `/gdcv/socio-v2` que es una variante de la vista de socio existente en `/gdcv/socio`. Es una vista de prueba para validar un nuevo diseño con el cliente.

Lee el archivo `flows/GDCV-socio/SOCIO_V2_CONTEXT.md` para entender todo el contexto: qué se construyó, cómo funciona, qué archivos se tocaron, el modelo de datos y qué falta.

El archivo principal del feature es `components/gdcv/SocioEnergyViewV2.tsx`.
Los datos están en `data/gdcv-socio-mock.ts` (sección "Mi Ahorro en Energía").
La ruta está en `app/gdcv/socio-v2/page.tsx`.

IMPORTANTE: No modificar componentes UI existentes en `components/ui/`. 
Todos los cambios deben ser aditivos o dentro de los archivos del feature.
```

---

> Tip: después de pegarle el prompt, pedile que abra y lea `SOCIO_V2_CONTEXT.md` antes de cualquier cambio.
