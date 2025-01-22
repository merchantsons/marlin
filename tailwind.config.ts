import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily:{
        poppins:['Poppins'],        
        GreyQo:['Grey Qo'],
        Qwitcher_Grypen:['Qwitcher Grypen'],
        Great_Vibes:['Great Vibes'],
        Cinzel:['Cinzel']
      },
      screens: {
        'cell': '320px',
        // => @media (min-width: 320px) { ... }
        
        'tablet': '640px',
        // => @media (min-width: 640px) { ... }
  
        'laptop': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'desktop': '1280px',
        // => @media (min-width: 1280px) { ... }
      },          
    },
  },
  plugins: [],
};
export default config;
