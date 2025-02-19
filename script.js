document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("generateButton").addEventListener("click", generateAndSetAvatar);
});

// Function to generate a SHA-256 hash from a string (email)
async function md5(str) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate an SVG avatar with a pattern centered around the middle
async function generateAvatar(email) {
    const hash = await md5(email);
    const size = 5; // Grid size (5x5)
    const cellSize = 16; // Each cell is 16px, making an 80x80px avatar
    const colors = ["#3498db", "#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6"]; // Color palette

    let svg = `<svg width="${size * cellSize}" height="${size * cellSize}" xmlns="http://www.w3.org/2000/svg">`;

    const center = Math.floor(size / 2); // Middle index for centering

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < Math.ceil(size / 2); x++) {
            let index = y * size + x;
            let shouldFill = parseInt(hash[index], 16) % 2 === 0;
            let color = colors[parseInt(hash[index], 16) % colors.length];

            // Distance from the center
            let distance = Math.abs(center - x) + Math.abs(center - y);
            let density = Math.max(0, 3 - distance); // Higher in the center, lower at edges

            if (shouldFill && density > 0) {
                let shapeType = parseInt(hash[index + 1], 16) % 3; // 0 = Square, 1 = Triangle, 2 = Circle
                let rotation = (parseInt(hash[index + 2], 16) % 4) * 90; // Random rotation for triangles

                if (shapeType === 0) {
                    // Draw a square
                    svg += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}" />`;
                    let mirrorX = (size - x - 1) * cellSize;
                    svg += `<rect x="${mirrorX}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}" />`;
                } else if (shapeType === 1) {
                    // Draw a rotated triangle
                    let points;
                    switch (rotation) {
                        case 0: points = `${x * cellSize},${y * cellSize} ${x * cellSize + cellSize},${y * cellSize} ${x * cellSize},${y * cellSize + cellSize}`; break;
                        case 90: points = `${x * cellSize + cellSize},${y * cellSize} ${x * cellSize + cellSize},${y * cellSize + cellSize} ${x * cellSize},${y * cellSize + cellSize}`; break;
                        case 180: points = `${x * cellSize},${y * cellSize} ${x * cellSize + cellSize},${y * cellSize} ${x * cellSize + cellSize},${y * cellSize + cellSize}`; break;
                        case 270: points = `${x * cellSize},${y * cellSize} ${x * cellSize},${y * cellSize + cellSize} ${x * cellSize + cellSize},${y * cellSize + cellSize}`; break;
                    }
                    svg += `<polygon points="${points}" fill="${color}" />`;

                    let mirrorX = (size - x - 1) * cellSize;
                    svg += `<polygon points="${points.replace(/^\d+/, mirrorX)}" fill="${color}" />`;
                } else {
                    // Draw a centered circle
                    svg += `<circle cx="${x * cellSize + cellSize / 2}" cy="${y * cellSize + cellSize / 2}" r="${cellSize / 3}" fill="${color}" />`;
                    let mirrorX = (size - x - 1) * cellSize;
                    svg += `<circle cx="${mirrorX + cellSize / 2}" cy="${y * cellSize + cellSize / 2}" r="${cellSize / 3}" fill="${color}" />`;
                }
            }
        }
    }

    svg += `</svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Generate and set the avatar when the button is clicked
async function generateAndSetAvatar() {
    let email = document.getElementById("emailInput").value.trim();
    if (email === "") {
        alert("Please enter an email address!");
        return;
    }
    let avatar = await generateAvatar(email);
    document.getElementById("avatar").src = avatar;
}
