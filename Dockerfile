FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html-production/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/angular-entropy /usr/share/nginx/html-production
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]