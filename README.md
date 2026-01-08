# ¿Quién Miente? 🎭

Un juego de fiesta presencial donde un jugador miente y los demás deben descubrirlo. Diseñado para 3-8 jugadores usando un solo teléfono.

## 🎮 Características

### Flujo del Juego
- **Selección de Modo**: Familiar o Adultos
- **Configuración de Jugadores**: 3-8 jugadores con nombres y avatares personalizados
- **Reparto Secreto de Roles**: Un mentiroso, el resto inocentes (pasando el teléfono)
- **Pregunta**: Una pregunta aleatoria del pack seleccionado
- **Conversación**: Fuera de la app, cada jugador cuenta su historia
- **Votación Secreta**: Cada jugador vota por quien cree que miente
- **Resultados**: Puntuación automática basada en aciertos
- **Mini Reto**: Castigo divertido para el perdedor

### Sistema de Puntuación
- **Inocentes aciertan**: +1 punto cada uno
- **Mentiroso gana** (no es descubierto): +2 puntos
- **Mentiroso pierde**: 0 puntos

### Packs de Preguntas

#### Pack Gratuito
- **Para Romper el Hielo**: 40 preguntas (20 familiares + 20 adultos)

#### Packs Premium ($2.99 cada uno)
- **Salseo Total**: Preguntas atrevidas para grupos con confianza
- **Dilemas Morales**: Escenarios hipotéticos que exploran tu forma de pensar
- **Recuerdos de la Infancia**: Anécdotas y vivencias de cuando erais niños
- **Historias de Viaje**: Aventuras, desastres y descubrimientos en tus viajes

### Tecnología

**Frontend:**
- React 19 + TypeScript
- TailwindCSS 4 con tema vibrante
- tRPC para comunicación tipo-segura
- PostHog para analytics anónimos

**Backend:**
- Express + tRPC
- MySQL/TiDB para almacenamiento de preguntas
- Stripe para pagos
- LocalStorage para gestión de packs desbloqueados

## 🚀 Desarrollo

### Instalación
```bash
pnpm install
```

### Base de Datos
```bash
# Aplicar migraciones
pnpm db:push

# Poblar con datos iniciales
pnpm tsx scripts/seed-data.mjs
```

### Desarrollo
```bash
pnpm dev
```

### Tests
```bash
pnpm test
```

## 📊 Analytics

El juego rastrea eventos anónimos con PostHog:
- `game_started`: Cuando se abre el juego
- `mode_selected`: Modo elegido (familiar/adultos)
- `players_selected`: Número de jugadores
- `question_shown`: Pregunta mostrada
- `voting_completed`: Votación finalizada
- `game_finished`: Ronda completada
- `pack_viewed`: Tienda visitada
- `pack_purchased`: Pack comprado

**Nota**: Para activar PostHog en producción, reemplaza `phc_dummy_key` en `client/src/contexts/AnalyticsContext.tsx` con tu clave real.

## 💳 Pagos con Stripe

### Modo Test
El proyecto está configurado con claves de test de Stripe. Usa la tarjeta de prueba:
- Número: `4242 4242 4242 4242`
- Fecha: Cualquier fecha futura
- CVC: Cualquier 3 dígitos

### Modo Producción
1. Ve a Settings → Payment en el panel de Manus
2. Completa la verificación KYC de Stripe
3. Las claves de producción se configurarán automáticamente

## 🎨 Diseño

- **Colores vibrantes**: Púrpura (#8b5cf6) como color principal
- **Tipografía grande**: Poppins para legibilidad en grupo
- **Botones prominentes**: Fáciles de pulsar en situaciones sociales
- **Navegación simple**: Sin confusión, flujo lineal

## 📝 Estructura del Proyecto

```
client/
  src/
    pages/          # Pantallas del juego
    contexts/       # Estado global (Game, Analytics)
    components/     # Componentes reutilizables
server/
  routers.ts        # Endpoints tRPC
  db.ts             # Consultas a base de datos
  stripe.ts         # Integración de Stripe
  products.ts       # Definición de productos
drizzle/
  schema.ts         # Esquema de base de datos
scripts/
  seed-data.mjs     # Script para poblar datos iniciales
```

## 🎯 Próximas Mejoras

- [ ] Más packs de preguntas temáticos
- [ ] Sistema de logros y estadísticas
- [ ] Modo multijugador online
- [ ] Personalización de avatares
- [ ] Compartir resultados en redes sociales

## 📄 Licencia

MIT

---

¡Diviértete jugando! 🎉
