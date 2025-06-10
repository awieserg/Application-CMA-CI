import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        cma: {
          green: "#18B980",
          greenLight: "#E8FBF3",
          blue: "#276EF1",
          blueNight: "#21325B",
          red: "#EB2A2A",
          accent: "#43DAB7",
        },
        game: {
          primary: "#8B5CF6",     // Violet vif
          secondary: "#F59E0B",   // Jaune orangé
          tertiary: "#10B981",    // Vert émeraude
          accent: "#EC4899",      // Rose vif
          background: "#F5F3FF",  // Violet très clair
          card: "#FFFFFF",        // Blanc
          dark: "#4C1D95",        // Violet foncé
          light: "#DDD6FE",       // Violet clair
          highlight: "#FBBF24",   // Jaune doré
          error: "#EF4444",       // Rouge vif
          // ajout de verts doux et un vert un peu plus clair
          greenLightSoft: "#F2FCE2",
          greenMedium: "#34D399" // vert plus vif, "teal-400"
        },
      },
      fontSize: {
        base: ["18px", "1.6"],
        lg: ["20px", "1.6"],
        xl: ["24px", "1.4"],
        "2xl": ["28px", "1.3"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.5rem", 
        "2xl": "2rem",
      },
      boxShadow: {
        game: "0 10px 15px -3px rgba(139, 92, 246, 0.3), 0 4px 6px -4px rgba(139, 92, 246, 0.4)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        highlight: "0 0 15px 2px rgba(251, 191, 36, 0.6)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: 'float 3s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
