# 🌐 Guía Definitiva: Cloudflare Tunnel para el Restaurante

Esta guía contiene todos los conceptos, comandos paso a paso y configuraciones para exponer tu aplicación web (tanto la demo actual como la futura arquitectura dockerizada) a internet de forma **gratuita, segura y con HTTPS automático**, sin necesidad de abrir puertos en el router ni configurar VPNs en los celulares.

---

## 📑 Contenido
1. [¿Por qué Cloudflare Tunnel es ideal para un restaurante?](#1-por-qué-cloudflare-tunnel-es-ideal-para-un-restaurante)
2. [Método Rápido: Probar la Demo en 1 Minuto (Sin registrar dominio)](#2-método-rápido-probar-la-demo-en-1-minuto-sin-registrar-dominio)
3. [Método de Producción: Con Dominio Propio (Gratis)](#3-método-de-producción-con-dominio-propio-gratis)
4. [Dockerización: `docker-compose.yml` con Cloudflare Tunnel](#4-dockerización-docker-composeyml-con-cloudflare-tunnel)
5. [Seguridad y Restricciones (Zero Trust)](#5-seguridad-y-restricciones-zero-trust)
6. [Hoja de Comandos Frecuentes (Cheat Sheet)](#6-hoja-de-comandos-frecuentes-cheat-sheet)

---

## 1. ¿Por qué Cloudflare Tunnel es ideal para un restaurante?

- **Cero puertos abiertos:** Tu router o firewall permanece cerrado; no te afecta el CGNAT de las operadoras (Claro, CNT, Netlife, etc.).
- **HTTPS Automático:** Certificado SSL oficial de Cloudflare sin renovaciones manuales.
- **Acceso universal:** Meseros y cocineros solo abren un enlace web en su navegador móvil (Safari, Chrome) sin instalar apps raras ni VPNs.
- **Caché para imágenes:** Acelera la carga de las fotos de los bolones, ceviches y jugos a través de los servidores de borde de Cloudflare.
- **Costo:** **$0 USD** (incluido 100% en el plan gratuito de Cloudflare Zero Trust).

---

## 2. Método Rápido: Probar la Demo en 1 Minuto (Sin registrar dominio)

Cloudflare ofrece una función llamada **Quick Tunnels** (*TryCloudflare*), que genera una URL pública aleatoria instantánea sin cuenta ni configuración.

### Paso 2.1: Instalar `cloudflared` en tu máquina

#### En Windows (PowerShell):
```powershell
winget install --id Cloudflare.cloudflared -e --accept-source-agreements --accept-package-agreements
```

> [!NOTE]
> Tras la instalación en Windows, cierra y vuelve a abrir tu terminal de PowerShell para que reconozca el comando `cloudflared`.

#### En Linux (Ubuntu / Debian):
```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
```

---

### Paso 2.2: Lanzar el túnel rápido apuntando a la Demo

Asegúrate de que la aplicación esté corriendo localmente (por ejemplo, en el puerto `5174` o `5173`):

```powershell
cloudflared tunnel --url http://localhost:5174
```

### Paso 2.3: Obtener tu enlace público

En la salida de la terminal verás una línea como esta:

```text
2026-11-01T... INF +--------------------------------------------------------------------------------------------+
2026-11-01T... INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
2026-11-01T... INF |  https://funny-banana-123.trycloudflare.com                                                |
2026-11-01T... INF +--------------------------------------------------------------------------------------------+
```

👉 **Copia ese enlace `https://...trycloudflare.com` y ábrelo desde cualquier celular:**
- Podrás ver el menú de bolones y mariscos.
- Podrás ingresar pedidos desde el teléfono y verlos sincronizados.

Para detener el túnel, simplemente presiona `Ctrl + C` en esa terminal.

---

## 3. Método de Producción: Con Dominio Propio (Gratis)

Cuando ya tengas tu propio dominio (ej. `elrincondelbolon.com`):

### Paso 3.1: Configurar el dominio en Cloudflare
1. Crea una cuenta gratuita en [cloudflare.com](https://www.cloudflare.com).
2. Agrega tu dominio y cambia los Nameservers en tu proveedor de dominio por los que te indique Cloudflare.

### Paso 3.2: Crear el Túnel desde el Panel Web (Más fácil y moderno)
1. Ve al panel de **Cloudflare Zero Trust** (`one.dash.cloudflare.com`).
2. En el menú lateral, dirígete a: **Networks** ➔ **Tunnels**.
3. Haz clic en **Create a Tunnel** y selecciona **Cloudflared**.
4. Nombra tu túnel: por ejemplo, `restaurante-servidor`.
5. Cloudflare te mostrará un comando con un **TOKEN SECRETO**.
   - Guarda ese token, tiene este formato:  
     `eyJhIjoiY2...`
6. En la pestaña **Public Hostnames**:
   - **Subdomain:** `pedidos` (o `comandas`, o déjalo vacío para el dominio raíz).
   - **Domain:** `elrincondelbolon.com`
   - **Service:**
     - **Type:** `HTTP`
     - **URL:** `localhost:80` (o el puerto de tu contenedor Nginx/Frontend).
7. Guarda los cambios. ¡Listo! Ahora `https://pedidos.elrincondelbolon.com` apunta directamente a tu servidor.

---

## 4. Dockerización: `docker-compose.yml` con Cloudflare Tunnel

Cuando tengas todo tu sistema con Base de Datos, Backend y Frontend, puedes incluir `cloudflared` como un servicio más dentro de Docker. Así no tienes que instalar nada directamente en el sistema operativo.

### Estructura de carpetas recomendada:
```text
mi-restaurante/
├── docker-compose.yml
├── frontend/             # Código de React / Vite
│   ├── Dockerfile
│   └── nginx.conf
├── backend/              # API REST + WebSockets (Node.js)
│   └── Dockerfile
└── .env                  # Variables privadas (tokens, claves)
```

### Archivo `docker-compose.yml` completo:

```yaml
version: '3.8'

services:
  # ---------------------------------------------
  # 1. BASE DE DATOS (PostgreSQL)
  # ---------------------------------------------
  database:
    image: postgres:16-alpine
    container_name: restaurante_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: restaurante_db
      POSTGRES_USER: usuario_restaurante
      POSTGRES_PASSWORD: ${DB_PASSWORD:-ClaveSuperSegura123}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - red_restaurante

  # ---------------------------------------------
  # 2. BACKEND (API REST + WebSockets)
  # ---------------------------------------------
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: restaurante_backend
    restart: unless-stopped
    environment:
      PORT: 4000
      DATABASE_URL: postgres://usuario_restaurante:${DB_PASSWORD:-ClaveSuperSegura123}@database:5432/restaurante_db
      JWT_SECRET: ${JWT_SECRET:-MiSecretoJwt2026}
    depends_on:
      - database
    networks:
      - red_restaurante

  # ---------------------------------------------
  # 3. FRONTEND (React compilado + Nginx Proxy)
  # ---------------------------------------------
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: restaurante_frontend
    restart: unless-stopped
    expose:
      - "80"
    depends_on:
      - backend
    networks:
      - red_restaurante

  # ---------------------------------------------
  # 4. CLOUDFLARE TUNNEL (Exposición segura)
  # ---------------------------------------------
  tunnel:
    image: cloudflare/cloudflared:latest
    container_name: restaurante_tunnel
    restart: unless-stopped
    command: tunnel run
    environment:
      - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
    depends_on:
      - frontend
    networks:
      - red_restaurante

networks:
  red_restaurante:
    driver: bridge

volumes:
  postgres_data:
```

> [!TIP]
> En la configuración del túnel en el panel de Cloudflare, la dirección del servicio destino para el frontend dentro de Docker será simplemente:  
> **`http://frontend:80`** (usando el nombre del servicio de Docker).

---

## 5. Seguridad y Restricciones (Zero Trust)

Una gran ventaja de Cloudflare frente a una VPN tradicional es que puedes aplicar reglas de acceso sin instalar software en los teléfonos de los meseros:

### A. Restricción por IP del Wi-Fi del Local
Si no quieres que nadie fuera del restaurante pueda entrar al sistema de comandas:
1. En el panel de **Cloudflare Zero Trust** ➔ **Access** ➔ **Applications**.
2. Crea una aplicación para `pedidos.elrincondelbolon.com`.
3. En **Policies**, agrega una regla:
   - **Action:** `Allow`
   - **Include:** `IP Ranges` ➔ Ingresa la IP pública del router de tu restaurante (la obtienes buscando *"mi ip"* en Google conectado al Wi-Fi del restaurante).
4. **Resultado:** Quien esté conectado al Wi-Fi del local entra directo sin contraseñas extra; quien intente entrar desde afuera con datos móviles o desde su casa queda bloqueado por Cloudflare.

### B. Autenticación por Código OTP (One-Time Pin)
Para gerentes o administradores que necesitan entrar desde fuera del local:
- Cloudflare puede pedir un correo electrónico antes de mostrar la página y enviar un código de 6 dígitos al email para autorizar la entrada.

---

## 6. Hoja de Comandos Frecuentes (Cheat Sheet)

| Acción | Comando |
| :--- | :--- |
| **Iniciar túnel rápido temporal** | `cloudflared tunnel --url http://localhost:5174` |
| **Iniciar sesión en Cloudflare por CLI** | `cloudflared tunnel login` |
| **Crear un túnel nombrado** | `cloudflared tunnel create <nombre-del-tunel>` |
| **Listar túneles creados** | `cloudflared tunnel list` |
| **Asociar túnel con subdominio DNS** | `cloudflared tunnel route dns <nombre-tunel> pedidos.midominio.com` |
| **Ejecutar túnel configurado** | `cloudflared tunnel run <nombre-tunel>` |
| **Verificar versión instalada** | `cloudflared --version` |
| **Instalar como servicio del sistema (Linux/Windows)** | `cloudflared service install` |

---

### Resumen del Flujo de Trabajo
1. **Hoy (Demo):** Usa `cloudflared tunnel --url http://localhost:5174` para mostrar la app en celulares al instante con un link temporal.
2. **Mañana (Desarrollo Docker):** Añade el servicio `tunnel` con su `TUNNEL_TOKEN` a tu `docker-compose.yml`.
3. **Producción (Restaurante):** Configura la regla de IP en Cloudflare Zero Trust para que solo opere dentro del Wi-Fi del restaurante.
