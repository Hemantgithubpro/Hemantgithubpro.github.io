# replit.md

## Overview

This is a personal portfolio website for Hemant Kumar Jha, a software developer student. The website showcases skills, projects, and provides contact information through a modern, responsive single-page application. The site features a clean, professional design with dark/light theme toggle functionality and interactive animations to create an engaging user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single-Page Application (SPA)**: Built with vanilla HTML, CSS, and JavaScript without any frameworks
- **Responsive Design**: Mobile-first approach using CSS Grid and Flexbox for layout management
- **Component-Based Structure**: Organized into distinct sections (Hero, About, Skills, Projects, Contact) with modular JavaScript functions
- **Theme System**: CSS custom properties (variables) enable dynamic light/dark theme switching
- **Animation Framework**: Custom JavaScript animations for typing effects, scroll-triggered animations, and skill progress bars

### Styling Strategy
- **CSS Custom Properties**: Centralized theme management through CSS variables for colors, shadows, and transitions
- **Modern CSS Features**: Utilizes CSS Grid, Flexbox, and custom properties for maintainable styling
- **External Dependencies**: Google Fonts (Inter) for typography and Font Awesome for icons
- **Responsive Breakpoints**: Mobile-first design with progressive enhancement for larger screens

### JavaScript Architecture
- **Modular Function Design**: Each feature (navigation, theme toggle, animations) is encapsulated in separate initialization functions
- **Event-Driven Programming**: DOM event listeners handle user interactions and scroll-based animations
- **Progressive Enhancement**: Core functionality works without JavaScript, with enhanced features layered on top
- **Performance Optimization**: Single DOMContentLoaded event listener initializes all functionality to minimize reflow

### User Experience Features
- **Interactive Navigation**: Hamburger menu for mobile with smooth animations and active link highlighting
- **Typing Animation**: Dynamic text animation for hero section to create engaging first impression
- **Scroll Animations**: Elements animate into view as user scrolls through the page
- **Skill Visualization**: Animated progress bars to showcase technical competencies
- **Project Filtering**: Interactive filtering system for portfolio projects
- **Contact Form**: Client-side form validation and submission handling

## External Dependencies

### CDN Resources
- **Google Fonts**: Inter font family for modern typography (weights: 300, 400, 500, 600, 700)
- **Font Awesome**: Version 6.4.0 for scalable vector icons throughout the interface

### Browser APIs
- **Local Storage**: For persisting user theme preference across sessions
- **Intersection Observer**: For efficient scroll-based animations and lazy loading
- **CSS Custom Properties**: For dynamic theme switching and consistent design tokens

### Development Tools
- **Vanilla JavaScript**: No build process or bundling required for simplicity
- **CSS Grid/Flexbox**: Modern layout systems for responsive design
- **CSS Transitions/Animations**: Hardware-accelerated animations for smooth user interactions