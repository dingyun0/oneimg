import type { ArticleModuleTemplate } from '@/types'
import { connect } from 'http2'

export const demoTemplate: ArticleModuleTemplate = {
  common: {
    container: {
        paddingTop: '30px',
        paddingBottom: '30px',
    },
    title: {},
    content: {
        marginTop: '30px',
    },
  },
  one: {
    container: {
      backgroundColor: 'var(--one-container-background)',
    },
    list: {
      backgroundImage: 'var(--one-list-background-image)',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }
  },
  hero: {
    container: {
      minHeight: '100px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
      color: 'var(--hero-container-foreground)',
      backgroundColor: 'var(--hero-container-background)',
      backgroundImage: 'var(--hero-container-background-image)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    },
    title: {
      position: 'relative',
      marginBottom: '16px',
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'var(--hero-title-foreground)',
      backgroundColor: 'var(--hero-title-background)',
    },
    content: {
      fontSize: '18px',
      lineHeight: 1.6,
      color: 'var(--hero-content-foreground)',
      backgroundColor: 'var(--hero-content-background)',
    },
  },
  main: {
    container: {
      padding: '24px',
      color: 'var(--main-container-foreground)',
      margin: '20px auto',
      width: '80%',
      backgroundColor:'white',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: 'var(--main-title-foreground)',
      backgroundColor: 'var(--main-title-background)',
    },
    content: {
      fontSize: '16px',
      lineHeight: 1.6,
      color: 'var(--main-content-foreground)',
      backgroundColor: 'var(--main-content-background)',
    },
  },
  sub: {
    container: {
      padding: '16px',
      marginTop: '16px',
      color: 'var(--sub-container-foreground)',
      backgroundColor: 'var(--sub-container-background)',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '12px',
      color: 'var(--sub-title-foreground)',
      backgroundColor: 'var(--sub-title-background)',
    },
    content: {
      fontSize: '15px',
      lineHeight: 1.5,
      color: 'var(--sub-content-foreground)',
      backgroundColor: 'var(--sub-content-background)',
    },
  },
} 