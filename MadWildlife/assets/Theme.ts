// Game-themed styling constants

export const COLORS = {
  // Light matcha green palette
  primary: '#C8D5B9',        // Light matcha green
  primaryDark: '#A8C295',    // Darker matcha
  primaryLight: '#E5EBD9',   // Very light matcha
  
  // Accent colors
  accent: '#8FA882',         // Forest green accent
  accentDark: '#6B8E5F',     // Darker forest
  
  // Backgrounds
  background: '#F5F7F0',     // Off-white with slight green tint
  cardBackground: '#FFFFFF',
  
  // Text
  text: '#2C3E2A',          // Dark forest green for text
  textSecondary: '#5C6E59', // Medium forest green
  textLight: '#8E9B8A',     // Light gray-green
  
  // UI Elements
  border: '#D4DCC9',
  shadow: '#2C3E2A',
  
  // Status colors
  success: '#7CAF5C',
  error: '#C85A54',
  warning: '#E6A84E',
};

export const FONTS = {
  // Silkscreen from Google Fonts - pixel/retro game font (for headings only)
  heading: 'Silkscreen_400Regular',
  headingBold: 'Silkscreen_700Bold',
  
  // System Arial font for body text
  body: 'System',
  bodyItalic: 'System',
  bodyBold: 'System',
  bodyLight: 'System',
  
  // Sizes
  sizes: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 28,
    xxlarge: 34,
  },
  
  // Weights (for fallback fonts)
  weights: {
    light: '300' as const,
    regular: '400' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  round: 50,
};