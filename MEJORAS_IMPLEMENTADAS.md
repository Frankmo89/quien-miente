# Mejoras Implementadas - "¿Quién Miente?"

## Resumen de Cambios

Se han implementado mejoras significativas al contenido del juego basadas en las especificaciones documentadas en la carpeta `scripts/`. Estas mejoras transforman el juego de preguntas superficiales a situaciones narrativas que generan conversaciones más auténticas y profundas.

## Cambios Principales

### 1. Preguntas Mejoradas para "Para Romper el Hielo"

**Antes:** Preguntas genéricas tipo "¿Cuál es tu comida favorita?" o "¿Qué superpoder te gustaría tener?"

**Ahora:** Situaciones narrativas en primera persona que los jugadores deben contar como si les hubiera pasado:
- **Familiar (20 preguntas):** Situaciones relacionadas con familia, amigos, relaciones y decisiones cotidianas
  - Ejemplo: "Ayer me encontré con mi expareja en el supermercado y nos tomamos un café juntos"
  - Ejemplo: "Choqué el auto de mi papá y le eché la culpa a mi hermano"

- **Adultos (20 preguntas):** Situaciones más atrevidas sobre relaciones, trabajo y decisiones morales
  - Ejemplo: "Salí con alguien mientras aún estaba en una relación"
  - Ejemplo: "Mentí en una entrevista de trabajo para conseguir el puesto"

### 2. Contenido Premium con Preguntas Completas

Todos los packs premium ahora tienen contenido completo:

#### Salseo Total (30 preguntas - Adultos)
Preguntas enfocadas en drama, chismes y dinámicas sociales complejas:
- "He visto a alguien importante en mi círculo haciendo algo que podría arruinar su reputación"
- "Sé que alguien está mintiendo pero todos le creen, incluyendo la persona afectada"

#### Dilemas Morales (15 familiar + 30 adultos)
Preguntas que exploran valores y decisiones éticas:
- "¿Mentirías para proteger a alguien que amas?"
- "¿Reportarías a un familiar si comete un crimen?"

#### Recuerdos de la Infancia (30 preguntas - Familiar)
Situaciones nostálgicas de la infancia:
- "Recuerdo que cuando era niño/a, mis papás me llevaban a un lugar especial cada fin de semana"
- "Tuve un maestro que cambió mi vida de forma positiva"

#### Historias de Viaje (20 familiar + 30 adultos)
Situaciones de aventuras y experiencias de viaje:
- "Tuve un viaje donde algo salió completamente mal pero terminó siendo la mejor historia"
- "Me perdí en una ciudad extranjera y tuve que improvisar"

### 3. Mini Retos Mejorados

**Antes:** Retos físicos simples como "Imita a tu animal favorito" o "Di el abecedario al revés"

**Ahora:** Retos que generan conversaciones profundas y conexión emocional:

#### Familiar (30 retos)
- Retos sociales y de comunicación
- Retos de creatividad
- Retos de confesión y vulnerabilidad
- Ejemplo: "Confiesa algo que nunca le has dicho a nadie en el grupo"

#### Adultos (30 retos)
- Retos atrevidos y vergonzosos
- Confesiones íntimas
- Verdades incómodas
- Ejemplo: "Cuéntale al grupo sobre tu mayor fracaso romántico"

## Filosofía del Diseño

### Cambio de Formato: De Preguntas a Situaciones

El cambio más importante es pasar de preguntas genéricas a **situaciones narrativas en primera persona**. Esto tiene varios beneficios:

1. **Más inmersión:** Los jugadores deben crear una historia completa, no solo responder sí/no
2. **Mejor para mentir:** Es más difícil detectar mentiras en narrativas que en respuestas simples
3. **Conversaciones más ricas:** Las historias generan más preguntas de seguimiento del grupo
4. **Conexión emocional:** Las situaciones evocan experiencias reales y generan empatía

### Principios de Diseño

1. **Enfoque en situaciones reales:** Las preguntas están basadas en experiencias comunes que la mayoría ha tenido o puede imaginar
2. **Balance de vulnerabilidad:** Desde situaciones livianas hasta confesiones profundas
3. **Generación de conversación:** Cada situación naturalmente lleva a preguntas de seguimiento
4. **Diversidad temática:** Cubre relaciones, familia, trabajo, ética, recuerdos y aventuras

## Implementación Técnica

### Archivos Modificados

1. **`scripts/seed-data.mjs`:** Archivo principal de seed actualizado con todo el contenido mejorado
2. **`scripts/seed-improved-content.mjs`:** Script alternativo que limpia y re-seed la base de datos
3. **`todo.md`:** Actualizado para reflejar el trabajo completado

### Estructura de Datos

Todas las preguntas y retos siguen la estructura existente:
- Questions tienen: `packId`, `questionText`, `mode` (`familiar`/`adultos`)
- Challenges tienen: `challengeText`, `mode` (`familiar`/`adultos`)

### Cómo Usar el Contenido Mejorado

**Opción 1: Setup inicial (recomendado)**
```bash
# Primero configura la base de datos
pnpm db:push

# Luego seed con el contenido mejorado
pnpm tsx scripts/seed-data.mjs
```

**Opción 2: Actualizar contenido existente**
```bash
# Este script limpia preguntas/retos existentes y los reemplaza
pnpm tsx scripts/seed-improved-content.mjs
```

## Impacto en el Juego

### Experiencia Mejorada del Jugador

1. **Historias más elaboradas:** Los jugadores necesitan crear narrativas creíbles
2. **Más interacción:** El grupo hace preguntas de seguimiento naturalmente
3. **Mayor rejugabilidad:** Incluso si se repite una situación, cada persona la contará diferente
4. **Conexión emocional:** Los temas tocados generan empatía y risas auténticas

### Diferenciación por Modo

- **Familiar:** Situaciones universales, apropiadas para grupos mixtos y familias
- **Adultos:** Temas más maduros sobre relaciones, sexo, ética laboral y decisiones difíciles

### Progresión Natural

Los packs tienen una progresión natural de intensidad:
1. **Para Romper el Hielo:** Situaciones cotidianas y universales
2. **Salseo Total:** Drama y dinámicas sociales complejas
3. **Dilemas Morales:** Decisiones éticas que revelan valores
4. **Recuerdos de la Infancia:** Nostalgia y vulnerabilidad
5. **Historias de Viaje:** Aventuras y momentos transformadores

## Próximos Pasos Recomendados

1. **Testing en grupos reales:** Probar el contenido con diferentes tipos de grupos
2. **Métricas de engagement:** Medir qué packs/preguntas generan más conversación
3. **Expansión de contenido:** Crear más packs temáticos siguiendo este formato narrativo
4. **Personalización:** Permitir a los usuarios crear sus propias situaciones

## Referencias

- Documentos de diseño originales en `scripts/improved-questions.md` y `scripts/improved-challenges.md`
- Ejemplos de implementación de otros packs en `scripts/office-secrets-pack.md` y `scripts/extreme-travel-pack.md`

---

**Nota:** Este contenido mejorado transforma "¿Quién Miente?" de un simple juego de preguntas a una experiencia de storytelling grupal que genera conexiones auténticas y conversaciones memorables.
