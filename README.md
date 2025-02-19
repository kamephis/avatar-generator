# SVG Avatar Generator

A lightweight **JavaScript-based avatar generator** that creates unique **80x80 pixel SVG avatars** based on an email hash. The avatars use a mix of **squares and right-angled triangles** in a symmetrical 5x5 grid, ensuring uniqueness.

## 🚀 Features
- **No external dependencies** (pure JavaScript)
- Generates **unique geometric avatars** based on email hashes
- Uses a mix of **squares and triangles**
- **Symmetrical patterns** for aesthetic consistency
- **Instant generation** (no API calls required)

## 📌 How It Works
1. The user enters an **email address**.
2. The **SHA-256 hash** of the email is generated.
3. The hash values determine:
   - Whether a cell should be filled.
   - The **color** of the shape.
   - The **shape type** (square or triangle).
   - The **triangle orientation** (4 possible directions).
4. The pattern is **mirrored for symmetry** and converted into **an SVG image**.
5. The SVG is displayed as a **data URL** in an `<img>` tag.

## 🛠 Usage
### **1. Clone the repository**
```sh
git clone https://github.com/kamephis/avatar-generator.git
cd avatar-generator
