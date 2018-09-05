FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

WORKDIR /usr/share/nginx/html

COPY dist/frontend .