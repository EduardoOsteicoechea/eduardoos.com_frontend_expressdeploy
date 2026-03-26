# Use a lightweight Node.js image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# ⚠️ CRUCIAL: Tell Docker to accept the Railway variable during the build step
ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL

# Build the static SvelteKit application
RUN npm run build

# Install a simple static file server globally
RUN npm install -g serve

# Railway provides a dynamic PORT, but we expose 3000 as a default
EXPOSE 3000

# Start the static server, pointing to the 'build' directory
# The -s flag tells it to route all requests to index.html (required for SPAs)
CMD ["serve", "-s", "build", "-l", "tcp://0.0.0.0:${PORT:-3000}"]