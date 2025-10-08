# ADDD - Creative Portfolio

> A modern, interactive portfolio application built with Next.js, featuring an immersive carousel experience for showcasing creative work.

## 🚀 Version 1.0.0

This is the first stable release of ADDD, featuring a sophisticated carousel-based portfolio interface with advanced interaction patterns.

## ✨ Features

### Core Functionality
- **Interactive Carousel**: Full-screen carousel with smooth transitions and gesture support
- **Multi-media Support**: Seamless integration of images and videos
- **Responsive Design**: Optimized for both desktop and mobile experiences
- **Theme Integration**: Dynamic theme switching based on content

### Advanced Interactions
- **Gesture Navigation**: Touch and mouse gesture support for intuitive navigation
- **Smart Cursor**: Dynamic cursor behavior with resize indicators
- **Pause/Resume**: Hold to pause functionality with visual feedback
- **Progress Tracking**: Visual progress bars for each slide
- **Asset Preloading**: Intelligent preloading of adjacent content

### Technical Features
- **Next.js 14**: Built with the latest Next.js App Router
- **Tailwind CSS**: Modern, utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **GraphQL Integration**: Content management with Hygraph
- **Performance Optimized**: Image optimization and lazy loading

## 🛠️ Quick Start

1. **Install dependencies**
```shell
npm install
```

2. **Set up environment variables**
Create a `.env.local` file with your Hygraph credentials:
```env
HYGRAPH_ENDPOINT="your-hygraph-endpoint"
HYGRAPH_TOKEN="your-hygraph-token"
```

3. **Start development server**
```shell
npm run dev
```

4. **Build for production**
```shell
npm run build
npm start
```

## 📱 Usage

### Navigation
- **Desktop**: Click left/right sides of screen or use mouse gestures
- **Mobile**: Tap left/right sides or swipe gestures
- **Pause**: Hold anywhere on screen to pause the carousel
- **Resume**: Release to resume automatic progression

### Content Management
Content is managed through Hygraph CMS, allowing for easy updates to:
- Images and videos
- Slide durations
- Captions and metadata
- Theme settings

## 🎨 Customization

The application is built with modularity in mind:
- Customizable carousel timing and behavior
- Flexible content layouts
- Theme-aware styling
- Responsive breakpoints

## 📦 Dependencies

- Next.js 14.2.7
- React 18.3.1
- Tailwind CSS 3.4.10
- Framer Motion 11.3.31
- GraphQL integration
- And more...

## 🔄 Changelog

### v1.0.0 (Current Release)
- Initial stable release
- Advanced carousel interactions
- Multi-media content support
- Responsive design implementation
- Performance optimizations
