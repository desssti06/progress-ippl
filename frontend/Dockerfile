# Gunakan Node.js versi LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh kode sumber
COPY . .

# Build aplikasi Next.js
RUN npm run build

# Expose port yang digunakan (biasanya 3000 untuk Next.js)
EXPOSE 3000

# Command untuk menjalankan aplikasi
CMD ["npm", "start"]