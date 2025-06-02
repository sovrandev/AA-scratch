import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  bg: {
    nav: '#0C0E14',
    main: '#0C0E14',
    box: '#151822',
    inner: '#1F2433',
    border: '#1F2433'
  },

  accent: {
    primary: '#305FEB',
    primaryGradient: 'linear-gradient(90deg, #9546FD 0%, #4E89C7 50%, #0FC397 100%)',
    primaryGradientLowOpacity: 'linear-gradient(90deg, #9546FD33 0%, #4E89C733 50%, #0FC39733 100%)',
  },

  text: {
    primary: '#FFFFFF',
    secondary: '#959597'
  },

  status: {
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3'
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px'
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px'
  },
  
  transitions: {
    fast: '0.15s ease',
    normal: 'all 0.2s ease'
  },
  
  breakpoints: {
    up: (key) => {
      const values = {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      };
      return `@media (min-width:${values[key]}px)`;
    },
    down: (key) => {
      const values = {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      };
      return `@media (max-width:${values[key]}px)`;
    },
    between: (start, end) => {
      const values = {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      };
      return `@media (min-width:${values[start]}px) and (max-width:${values[end]}px)`;
    },
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    }
  },
  
  zIndex: {
    dropdown: 100,
    sticky: 200,
    modal: 300,
    tooltip: 400
  },
  
  blue: '#5D9DFE',
  red: '#FF3C3C',
  yellow: '#FFDF37',
  green: '#36FF93',
  spacing: 8, 
});

export default theme;