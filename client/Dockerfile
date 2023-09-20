# Stage 1 - the build process
FROM node:18.14.2-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN rm -rf dist
RUN npm run build

# Add .env file
COPY .docker.env .env

# Stage 2 - the production environment
FROM nginx:1.19-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
