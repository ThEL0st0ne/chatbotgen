# Use official Nginx image
FROM nginx:stable-alpine

# Set the working directory to Nginx's default serving directory
WORKDIR /usr/share/nginx/html

# Copy all static files from FRONTEND to the container
COPY . .

# Expose port 80 (default Nginx port)
EXPOSE 80

# Run Nginx in the foreground (no daemon mode)
CMD ["nginx", "-g", "daemon off;"]
