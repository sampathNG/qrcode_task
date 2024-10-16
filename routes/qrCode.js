// const { createCanvas } = require("canvas");
// const QRCode = require("qrcode");
// // Function to create a diamond shape and overlay a QR code
// async function createDiamondWithQRCode(text) {
//   // Create a canvas
//   const width = 400;
//   const height = 400;
//   const canvas = createCanvas(width, height);
//   const ctx = canvas.getContext("2d");
//   // Draw a diamond shape
//   ctx.fillStyle = "#FFFFFF"; // Diamond color
//   ctx.beginPath();
//   ctx.moveTo(width / 2, 0); // Top point
//   ctx.lineTo(width, height / 2); // Right point
//   ctx.lineTo(width / 2, height); // Bottom point
//   ctx.lineTo(0, height / 2); // Left point
//   ctx.closePath();
//   ctx.fill();
//   // Generate QR code
//   const qrCodeDataUrl = await QRCode.toDataURL(text, {
//     width: 100,
//     margin: 1,
//   });
//   // Draw the QR code on the canvas
//   const img = await loadImage(qrCodeDataUrl);
//   const qrCodeX = (width - img.width) / 2; // Center the QR code
//   const qrCodeY = (height - img.height) / 2; // Center the QR code
//   ctx.drawImage(img, qrCodeX, qrCodeY);
//   // Calculate the remaining space around the QR code
//   const remainingSpaceX = width - img.width;
//   const remainingSpaceY = height - img.height;
//   // Draw dots in the remaining space
//   const dotSize = 8; // Size of each dot
//   const dotSpacing = 16; // Spacing between dots
//   // Create a 2D array to track drawn dots
//   const dotMatrix = Array(height)
//     .fill(0)
//     .map(() => Array(width).fill(0));
//   // Function to check if dot can be drawn at position
//   function canDrawDot(x, y) {
//     // Check if within canvas bounds
//     if (x < 0 || x >= width || y < 0 || y >= height) return false;
//     // Check if dot already drawn at position
//     if (dotMatrix[y][x] === 1) return false;
//     // Check if QR code area
//     if (
//       x >= qrCodeX &&
//       x <= qrCodeX + img.width &&
//       y >= qrCodeY &&
//       y <= qrCodeY + img.height
//     )
//       return false;
//     return true;
//   }
//   // Draw dots
//   for (let y = 0; y < height; y += dotSpacing) {
//     for (let x = 0; x < width; x += dotSpacing) {
//       if (canDrawDot(x, y)) {
//         ctx.fillStyle = "#000"; // Color of the dots
//         ctx.fillRect(x, y, dotSize, dotSize);
//         dotMatrix[y][x] = 1; // Mark position as drawn
//       }
//     }
//   }
//   // Save canvas to file
//   const buffer = canvas.toBuffer("image/png");
//   require("fs").writeFileSync("diamond_qrcode.png", buffer);
//   console.log("Diamond with QR code created: diamond_qrcode.png");
// }
// // Load image utility
// const { loadImage } = require("canvas");
// // Call function with text to encode in QR code
// createDiamondWithQRCode("https://example.com");
//
const { createCanvas } = require("canvas");
const QRCode = require("qrcode");

// Function to generate QR code-filled image
async function generateQrCodeImage(text, gridSize) {
  // Calculate canvas dimensions
  const width = gridSize * 100;
  const height = gridSize * 100;

  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Generate QR code
  const qrCodeDataUrl = await QRCode.toDataURL(text, {
    width: 100,
    margin: 1,
  });
  const qrImage = await loadImage(qrCodeDataUrl);

  // Fill canvas with QR codes
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      // Randomly rotate QR code
      const rotation = Math.floor(Math.random() * 4) * 90;
      ctx.save();
      ctx.translate(x * 100 + 50, y * 100 + 50);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(qrImage, -50, -50);
      ctx.restore();
    }
  }

  // Save canvas to file
  const buffer = canvas.toBuffer("image/png");
  require("fs").writeFileSync("qr_code_image.png", buffer);
  console.log("QR code-filled image generated: qr_code_image.png");
}

// Load image utility
const { loadImage } = require("canvas");

// Call function with text to encode and grid size
generateQrCodeImage("https://example.com", 1);
