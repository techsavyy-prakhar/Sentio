/* ===== COLOR PALETTES ===== */
export const Colors = {
  light: {
    background: '#faf9f5',
    surface: '#ffffff',
    text: '#1f2937',
    subtext: '#6b7280',
    border: '#e5e7eb',

    primary: '#2563eb',
    secondary: '#D9A54C',
    error: '#ff3b30',
    success: '#10b981',
    warning: '#F59E0B',

    tabBar: '#f8f9fa',
    card: '#ffffff',
    input: '#ffffff',
    inputBorder: '#ddd',
    placeholder: '#999',

    tabIconSelected: '#2563eb',
    tabIconDefault: '#9ca3af',
  },
  dark: {
    background: '#0a0a0a',
    surface: '#141414',
    text: '#ffffff',
    subtext: '#9ca3af',
    border: '#1f1f1f',

    primary: '#6366f1',
    secondary: '#D9A54C',
    error: '#ef4444',
    success: '#10b981',
    warning: '#F59E0B',

    tabBar: '#1a1a1a',
    card: '#141414',
    input: '#0f0f0f',
    inputBorder: '#242424',
    placeholder: '#6b7280',

    tabIconSelected: '#6366f1',
    tabIconDefault: '#6b7280',
  },
};

/* ===== GRADIENTS ===== */
export const Gradients = {
  logo: ['#ddac5f', '#c9913e'],
  primary: ['#6366f1', '#8b5cf6'],
  error: ['#ef4444', '#dc2626'],
  success: ['#10b981', '#059669'],
  aiBuilder: ['#0F172A', '#1E1B4B', '#6D28D9'],
};

/* ===== SPACING SCALE ===== */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

/* ===== TYPOGRAPHY SCALE ===== */
export const Typography = {
  display: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyStrong: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  captionStrong: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
};

/* ===== BORDER RADIUS ===== */
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

/* ===== SHADOWS ===== */
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
};

export default {
  light: Colors.light,
  dark: Colors.dark,
};
