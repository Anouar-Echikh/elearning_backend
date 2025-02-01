# Use the official NGINX image as a base image
FROM nginx:latest

# Set the working directory inside the container
WORKDIR /etc/nginx

# Create the SSL directory (if it doesn't exist)
RUN mkdir -p /etc/nginx/ssl

# Copy the NGINX configuration file
COPY ./default.conf /etc/nginx/conf.d/default.conf

# Copy the SSL certificates from the local machine to the container
COPY ./fullchain.pem /etc/nginx/ssl/
COPY ./privkey.pem /etc/nginx/ssl/
COPY ./options-ssl-nginx.conf /etc/nginx/ssl/
COPY ./ssl-dhparams.pem /etc/nginx/ssl/

# Expose the necessary ports
EXPOSE 80 443

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]

