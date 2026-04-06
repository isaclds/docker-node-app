#!/bin/bash

set -e  # Exit on error

echo "========================================="
echo "SSL Certificate Generation Script"
echo "========================================="

echo "📁 Creating directory structure..."
mkdir -p ../ca
mkdir -p ../ssl/certs ../ssl/private

# Clean up old files 
rm -f ../ca/ca.key ../ca/ca.crt ../ca/ca.srl ../ca/server.csr 2>/dev/null
rm -f ../ssl/certs/server.crt 2>/dev/null
rm -f ../ssl/private/server.key 2>/dev/null
echo ""
echo "========================================="
echo "Step 1: Creating Certificate Authority (CA)"
echo "========================================="

echo "🔑 Generating CA private key (ca.key)..."
openssl genrsa -aes256 -out ../ca/ca.key 4096

echo "📜 Generating CA certificate (ca.crt)..."
openssl req -new -x509 -days 365 -key ../ca/ca.key -out ../ca/ca.crt \
  -subj "/C=BR/ST=SC/L=Florianopolis/O=TEST/CN=MY-TEST-CA"

echo "✅ CA certificate created successfully!"

echo ""
echo "========================================="
echo "Step 2: Creating Server Certificate"
echo "========================================="

echo "🔑 Generating server private key (server.key)..."
openssl genrsa -out ../ssl/private/server.key 2048

echo "📝 Generating Certificate Signing Request (server.csr)..."
openssl req -new -key ../ssl/private/server.key -out ../ca/server.csr \
  -subj "/C=BR/ST=SC/L=Florianopolis/O=TEST/CN=localhost"

echo "✍️  Signing certificate with CA..."
openssl x509 -req -extfile <(printf "subjectAltName=DNS:localhost,IP:127.0.0.1") \
  -days 365 -in ../ca/server.csr -CA ../ca/ca.crt -CAkey ../ca/ca.key \
  -CAcreateserial -out ../ssl/certs/server.crt

echo "✅ Server certificate created successfully!"

echo ""
echo "========================================="
echo "Step 3: Setting Permissions"
echo "========================================="

chmod 600 ../ssl/private/server.key
chmod 600 ../ca/ca.key
chmod 644 ../ssl/certs/server.crt
chmod 644 ../ca/ca.crt

echo "✅ Permissions set correctly"

echo ""
echo "========================================="
echo "✅ Certificate Generation Complete!"
echo "========================================="
echo ""
echo "Files created:"
echo "  📁 CA Files:"
echo "    - ../ca/ca.key     (CA Private Key - KEEP SECRET!)"
echo "    - ../ca/ca.crt     (CA Certificate - Import in browser)"
echo "    - ../ca/ca.srl     (Serial number file)"
echo "    - ../ca/server.csr (Certificate Signing Request)"
echo ""
echo "  📁 Server Files:"
echo "    - ../ssl/private/server.key (Server Private Key)"
echo "    - ../ssl/certs/server.crt   (Server Certificate)"
echo ""
echo "========================================="
echo "Next Steps:"
echo "========================================="
echo ""
echo "1. Import CA certificate in your browser:"
echo "   - Chrome/Edge: Settings → Privacy → Security → Manage certificates"
echo "   - Firefox: Settings → Privacy & Security → View Certificates"
echo "   - Import ../ca/ca.crt as a Trusted Root Certificate Authority"
echo ""
echo "2. Test HTTPS:"
echo "   - HTTP:  http://localhost:8080"
echo "   - HTTPS: https://localhost:8443"
echo ""
echo "3. Verify with curl:"
echo "   curl -k https://localhost:8443"
echo "   curl --cacert ../ca/ca.crt https://localhost:8443"
echo ""
echo "========================================="