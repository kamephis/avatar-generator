// Function to generate a SHA-256 hash of the input string (email)
function md5(str) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then(buf => {
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    });
}

// Function to generate an SVG avatar based on the hash of an email
async function generateAvatar(email) {
    const hash = await md5(email); // Generate hash from the email
    const size = 5; // Grid size (5x5)
    const cellSize = 16; // Size of each grid cell (16px for an 80x80 avatar)
    const colors = ["#3498db", "#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6"]; // Color palette

    let svg = `<svg width="${size * cellSize}" height="${size * cellSize}" xmlns="http://www.w3.org/2000/svg">`;

    // Loop through grid cells
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < Math.ceil(size / 2); x++) {
            let index = y * size + x;
            let shouldFill = parseInt(hash[index], 16) % 2 === 0; // Determines whether to draw in this cell
            let color = colors[parseInt(hash[index], 16) % colors.length]; // Select a color from the palette
            let shapeType = parseInt(hash[index + 1], 16) % 2; // 0 = Square, 1 = Triangle
            let orientation = parseInt(hash[index + 2], 16) % 4; // Determines triangle rotation (4 possible)

            if (shouldFill) {
                if (shapeType === 0) {
                    // Draw a square
                    svg += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}" />`;

                    // Mirror the square on the other half of the grid
                    let mirrorX = (size - x - 1) * cellSize;
                    svg += `<rect x="${mirrorX}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}" />`;
                } else {
                    // Determine triangle points based on orientation
                    let points;
                    switch (orientation) {
                        case 0: points = `${x * cellSize},${y * cellSize} ${x * cellSize + cellSize},${y * cellSize} ${x * cellSize},${y * cellSize + cellSize}`; break;
                        case 1: points = `${x * cellSize + cellSize},${y * cellSize} ${x * cellSize + cellSize},${y * cellSize + cellSize} ${x * cellSize},${y * cellSize + cellSize}`; break;
                        case 2: points = `${x * cellSize},${y * cellSize} ${x * cellSize + cellSize},${y * cellSize} ${x * cellSize + cellSize},${y * cellSize + cellSize}`; break;
                        case 3: points = `${x * cellSize},${y * cellSize} ${x * cellSize},${y * cellSize + cellSize} ${x * cellSize + cellSize},${y * cellSize + cellSize}`; break;
                    }
                    svg += `<polygon points="${points}" fill="${color}" />`;

                    // Mirror the triangle on the other half of the grid
                    let mirrorX = (size - x - 1) * cellSize;
                    switch (orientation) {
                        case 0: points = `${mirrorX},${y * cellSize} ${mirrorX + cellSize},${y * cellSize} ${mirrorX},${y * cellSize + cellSize}`; break;
                        case 1: points = `${mirrorX + cellSize},${y * cellSize} ${mirrorX + cellSize},${y * cellSize + cellSize} ${mirrorX},${y * cellSize + cellSize}`; break;
                        case 2: points = `${mirrorX},${y * cellSize} ${mirrorX + cellSize},${y * cellSize} ${mirrorX + cellSize},${y * cellSize + cellSize}`; break;
                        case 3: points = `${mirrorX},${y * cellSize} ${mirrorX},${y * cellSize + cellSize} ${mirrorX + cellSize},${y * cellSize + cellSize}`; break;
                    }
                    svg += `<polygon points="${points}" fill="${color}" />`;
                }
            }
        }
    }

    svg += `</svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Function to generate and display the avatar
async function generateAndSetAvatar() {
    let email = document.getElementById("emailInput").value.trim();
    if (email === "") {
        alert("Please enter an email address!");
        return;
    }
    let avatar = await generateAv
