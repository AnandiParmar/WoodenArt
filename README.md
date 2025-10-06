# Wooden Art - Modern Next.js Application

A beautiful and modern Next.js application with an animated logo that transitions from center to navbar on scroll. Built with TypeScript, Tailwind CSS, and the latest web technologies.

## ✨ Key Features

- **Animated Logo**: Logo appears centered on page load and smoothly transitions to navbar on scroll
- **Scroll Detection**: Smart scroll-based animations and transitions
- **Responsive Design**: Mobile-first approach with beautiful responsive layouts
- **Color Theme System**: Comprehensive CSS custom properties for consistent theming
- **Modern UI**: Clean, modern design with smooth animations and transitions
- **Dark Mode Support**: Automatic dark mode detection and styling
- **Accessibility**: Built with accessibility best practices

## 🎨 Design System

### Color Palette
- **Primary**: Orange/Amber tones (#f2850a)
- **Secondary**: Slate/Gray tones (#64748b)
- **Accent**: Blue tones (#0ea5e9)
- **Neutral**: Comprehensive gray scale

### Animations
- Fade in/out transitions
- Scale animations
- Smooth scroll-based logo transitions
- Hover effects and micro-interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd wooden-art
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles with color theme
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page with sections
└── components/
    ├── animated-logo.tsx    # Logo component with animations
    ├── navbar.tsx           # Navigation bar component
    └── scroll-logo.tsx      # Scroll-aware logo wrapper
```

## 🎯 Key Components

### AnimatedLogo
- Handles both centered and navbar logo states
- Smooth transitions and animations
- Responsive design

### Navbar
- Fixed position with backdrop blur
- Mobile-responsive menu
- Scroll-based styling changes

### ScrollLogo
- Manages logo visibility based on scroll position
- Smooth fade out when scrolling down
- Appears centered on page load

## 🎨 Customization

### Colors
Modify the color variables in `src/app/globals.css`:
```css
:root {
  --primary-500: #f2850a;  /* Main brand color */
  --secondary-500: #64748b; /* Secondary color */
  --accent-500: #0ea5e9;    /* Accent color */
}
```

### Logo
Update the logo in `src/components/animated-logo.tsx`:
- Change the "W" icon
- Modify the company name
- Adjust colors and styling

### Animations
Customize animations in `src/app/globals.css`:
- Logo transition timing
- Fade in/out effects
- Hover animations

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Use `npm run build` and deploy the `.next` folder
- **Railway**: Connect your GitHub repository

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist Sans & Geist Mono
- **Linting**: ESLint
- **Formatting**: Prettier

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).