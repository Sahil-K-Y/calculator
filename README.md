# Professional Calculator

A modern, fully-featured web calculator built with vanilla HTML, CSS, and JavaScript. No dependencies, no frameworks, no `eval()`.

## Features

- **Safe Math Engine** – Proper arithmetic without `eval()`
- **Expression Preview** – See your full calculation before hitting =
- **Keyboard Support** – Type digits and operators like a real calculator
- **Thousand Separators** – Formatted numbers for easy reading
- **Sign Toggle (±)** – Quickly flip between positive and negative
- **Percentage (%)** – Divide by 100 in one tap
- **Chain Calculations** – Press = after any operation to continue
- **Error Handling** – Division by zero and overflow are caught cleanly
- **Responsive Design** – Works on desktop, tablet, and mobile
- **Modern Dark UI** – Premium glassmorphism aesthetic with smooth animations
- **Zero Dependencies** – Pure HTML/CSS/JS, no libraries or frameworks

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (Grid, Custom Properties, Animations) |
| Logic | Vanilla JavaScript (ES6+) |

## Quick Start

```bash
git clone https://github.com/Sahil-K-Y/calculator.git
cd calculator
open index.html
```

No build step required. Open `index.html` in any modern browser and start calculating.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0-9` | Digit input |
| `.` | Decimal point |
| `+` `-` `*` `/` | Operators |
| `Enter` or `=` | Calculate |
| `Backspace` | Delete last digit |
| `Escape` or `Delete` | Clear all (AC) |
| `%` | Percent |

## What Makes It Professional

- **No `eval()`** – The calculation engine uses a safe, explicit arithmetic function. No code injection risk, no unexpected behavior.
- **Floating Point Sanitization** – Results are rounded to 12 significant digits to avoid `0.1 + 0.2 = 0.30000000000000004`.
- **Input Limits** – Maximum 16 digits to prevent display overflow.
- **Responsive Font Scaling** – Display font shrinks gracefully with very long numbers.
- **Operator Highlighting** – The active operator button lights up so you always know what's pending.
- **Smooth Animations** – Subtle scale and ripple effects give tactile feedback.

## License

MIT

---

Built by [Sahil Kumar](https://github.com/Sahil-K-Y)
