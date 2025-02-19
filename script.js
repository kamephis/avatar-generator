document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("generateButton").addEventListener("click", generateAndSetAvatar);
    document.getElementById("downloadButton").addEventListener("click", downloadAvatar);
});

// Function to generate a SHA-256 hash from an email
async function md5(str) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate an SVG avatar with modern-art style patterns
async function generateAvatar(email) {
    const hash = await md5(email);
    const size = 4;
    const cellSize = 80 / size;
    const colors = ["#3498db", "#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6", "#ff5733", "#6a0dad", "#d35400"];

    let svg = `<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">`;
    let bgColor = colors[Math.floor(Math.random() * colors.length)];
    svg += `<rect width="80" height="80" fill="${bgColor}" />`;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let index = (y * size + x) % hash.length;
            let color = colors[parseInt(hash[index], 16) % colors.length];
            let shapeType = parseInt(hash[index + 1], 16) % 4;
            let rotation = (parseInt(hash[index + 2], 16) % 4) * 90;
            let shapeSize = cellSize * (0.8 + Math.random() * 0.5);
            let offsetX = (Math.random() * (cellSize - shapeSize)) / 2;
            let offsetY = (Math.random() * (cellSize - shapeSize)) / 2;

            if (shapeType === 0) {
                svg += `<rect x="${x * cellSize + offsetX}" y="${y * cellSize + offsetY}" width="${shapeSize}" height="${shapeSize}" fill="${color}" transform="rotate(${rotation},${x * cellSize + cellSize / 2},${y * cellSize + cellSize / 2})" />`;
            } else if (shapeType === 1) {
                let points;
                switch (rotation) {
                    case 0: points = `${x * cellSize},${y * cellSize} ${x * cellSize + cellSize},${y * cellSize} ${x * cellSize},${y * cellSize + cellSize}`; break;
                    case 90: points = `${x * cellSize + cellSize},${y * cellSize} ${x * cellSize + cellSize},${y * cellSize + cellSize} ${x * cellSize},${y * cellSize + cellSize}`; break;
                    case 180: points = `${x * cellSize},${y * cellSize} ${x * cellSize + cellSize},${y * cellSize} ${x * cellSize + cellSize},${y * cellSize + cellSize}`; break;
                    case 270: points = `${x * cellSize},${y * cellSize} ${x * cellSize},${y * cellSize + cellSize} ${x * cellSize + cellSize},${y * cellSize + cellSize}`; break;
                }
                svg += `<polygon points="${points}" fill="${color}" />`;
            } else if (shapeType === 2) {
                svg += `<circle cx="${x * cellSize + cellSize / 2}" cy="${y * cellSize + cellSize / 2}" r="${shapeSize / 3}" fill="${color}" />`;
            }
        }
    }

    svg += `</svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Generate and set the avatar in all previews
async function generateAndSetAvatar() {
    let email = document.getElementById("emailInput").value.trim();
    if (email === "") {
        alert("Please enter an email address!");
        return;
    }

    let avatar = await generateAvatar(email);
    ["avatarCircle", "avatarSquare", "avatarRounded"].forEach(id => {
        let img = document.getElementById(id);
        img.src = avatar;
        img.style.display = "block";
    });

    document.getElementById("downloadButton").style.display = "block"; // Show download button
}

// Download the generated avatar
function downloadAvatar() {
    let link = document.createElement("a");
    link.href = document.getElementById("avatarSquare").src;
    link.download = "avatar.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
