# Guía para Agregar Testimonios de Clientes

## Por qué importa

El PRD (§13) requiere que los testimonios expresen **transformación**, no solo satisfacción:

```
Mal testimonio:
"Excelente servicio. Muy recomendable."

Buen testimonio:
"Antes tenía problemas para... Ahora... Conseguimos..."
```

El lenguaje del cliente tiene prioridad sobre el lenguaje corporativo.

---

## Estructura del testimonio

Cada testimonio debe seguir este patrón:

```json
{
  "name": "Nombre del Cliente",
  "role": "Cargo, Empresa",
  "photo": "/nombre-foto.webp",
  "quote": "Antes teníamos [problema]. Después de trabajar con Crow Systems, [cambio]. Ahora [resultado concreto].",
  "project": "Tipo de proyecto (opcional)"
}
```

### Reglas

1. **Nunca inventar** testimonios, nombres, empresas ni resultados
2. **Priorizar** transformación sobre actividad
3. **Usar lenguaje del cliente**, no lenguaje corporativo
4. **Incluir** antes → después → resultado cuando sea posible
5. **Solo agregar** cuando exista consentimiento del cliente

---

## Pasos para implementar

### 1. Agregar datos al locale JSON

En `src/locales/es.json`, dentro de `pages.services`, agregar:

```json
"testimonials": {
  "title": "Lo que dicen nuestros clientes",
  "items": [
    {
      "name": "María López",
      "role": "Directora, Restaurante El Sabor",
      "photo": "/maria-lopez.webp",
      "quote": "Antes perdíamos tiempo conectando sistemas que no se hablaban. Ahora todo funciona junto y我们的equipo puede enfocarse en servir a los clientes."
    }
  ]
}
```

Hacer lo mismo en `src/locales/en.json` con la versión en inglés.

### 2. Agregar fotos de clientes

Colocar las fotos en `public/` con formato `.webp` preferentemente.

### 3. Agregar la sección visual en `servicios.astro`

Insertar después del FAQ y antes del CTA:

```astro
---
// Dentro del frontmatter, acceder a los datos:
const testimonials = data.pages.services.testimonials;
---

{testimonials && testimonials.items.length > 0 && (
  <section class="pb-24 px-6 max-w-7xl mx-auto" aria-labelledby="testimonials-heading">
    <h2 id="testimonials-heading" class="font-heading text-3xl font-bold text-on-surface text-center mb-12">
      {testimonials.title}
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.items.map((t) => (
        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8">
          <blockquote class="italic text-on-surface-variant text-sm leading-relaxed mb-6 border-l-2 border-primary/30 pl-4">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div class="flex items-center gap-3">
            {t.photo && (
              <img src={t.photo} alt={t.name} class="w-10 h-10 rounded-full object-cover" />
            )}
            <div>
              <p class="font-bold text-sm text-on-surface">{t.name}</p>
              <p class="text-xs text-on-surface-variant">{t.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
)}
```

### 4. Verificar

```bash
bun run build
```

---

## Ejemplo de testimonio bien estructurado

```json
{
  "name": "Roberto Méndez",
  "role": "Dueño, AutoService Méndez",
  "photo": "roberto-mendez.webp",
  "quote": "Teníamos problemas para que los clientes nos encontraran online. Nuestro sitio se veía mal en celular y no aparecíamos en Google. Después de trabajar con Crow Systems, nuestro sitio se ve profesional desde cualquier celular y empezamos a recibir mensajes de clientes que nos buscaron en Google."
}
```

### Por qué funciona

| Elemento | Cumple |
|----------|--------|
| Antes (problema) | "Teníamos problemas para que los clientes nos encontraran" |
| Después (cambio) | "Nuestro sitio se ve profesional desde cualquier celular" |
| Resultado | "Empezamos a recibir mensajes de clientes que nos buscaron en Google" |
| Lenguaje del cliente | Sí, sin jerga técnica |
| Verificable | Sí, resultado observable |
| Sin inventar métricas | No dice "aumentamos ventas 30%" |

---

## Qué NO hacer

- **No inventar** testimonios para "completar" la sección
- **No usar** lenguaje genérico como "Excelente servicio"
- **No inventar** métricas como "aumentó ventas 300%"
- **No copiar** el mismo testimonio en ambos idiomas sin traducir
- **No agregar** fotos de stock — solo fotos reales del cliente
- **No publicar** sin consentimiento del cliente
