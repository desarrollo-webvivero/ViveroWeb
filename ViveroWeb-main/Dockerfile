# Etapa 1: Construcción (Build)
FROM node:alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm ci

# Copiar el resto del código fuente del proyecto
COPY . .

# Ejecutar el comando de construcción para la SPA (genera la carpeta dist)
RUN npm run build

# Etapa 2: Producción (Nginx)
FROM nginx:alpine

# Copiar los archivos estáticos compilados desde la etapa anterior al directorio público de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80 del contenedor
EXPOSE 80

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
