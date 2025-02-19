import type { ArticleModuleTemplate, CustomCSSProperties } from '@/types/template'
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family'

export const commonTypography: CustomCSSProperties = {
  '& :where(p)': {
    marginTop: '5px',
    marginBottom: '5px',
    lineHeight: 1.7,
    fontSize: '4px',
  },
  '& (h1)': {
    fontSize: '6rem',
    backgroundColor: 'red',
  },
  '& :where(code)': {
    backgroundColor: 'var(--gray-2)',
    borderRadius: '0.4rem',
    color: 'var(--black)',
    fontSize: '0.85rem',
    padding: '0.25em 0.3em',
  },
  '& :where(pre)': {
    background: 'var(--black)',
    borderRadius: '0.5rem',
    color: 'var(--white)',
    fontFamily: 'JetBrainsMono, monospace',
    margin: '1.5rem 0',
    padding: '0.75rem 1rem',
    code: {
      background: 'none',
      color: 'inherit',
      fontSize: '0.8rem',
      padding: '0',
    },
  },
  '& :where(h1)': {
    fontSize: '4rem',
    backgroundColor: 'red',
  },
  '& :where(hr)': {
    border: 'none',
    borderTop: '1px solid var(--gray-2)',
    margin: '2rem 0',
  },
  '& :where(blockquote)': {
    borderLeft: '3px solid var(--gray-2)',
    margin: '1.5rem 0',
    paddingLeft: '1rem',
  },
  '& :where(img)': {
    display: 'block',
  },
  '& :where(ul)': {
    listStyleType: 'disc',
    paddingLeft: '1.625rem',
  },
  '& :where(ol)': {
    listStyleType: 'decimal',
    paddingLeft: '1.625rem',
  },
  '& :where(ul>li, ol>li)': {
    marginTop: '.75rem',
    marginBottom: '.75rem',
  },
  '& :where(ul ul, ol ul, ol ol, ul ol)': {
    marginTop: '.75rem',
    marginBottom: '.75rem',
  },
  '& [data-class="oneimg-images"]': {
    display: 'grid',
    rowGap: '0.5rem',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    marginTop: '5px',
    marginBottom: '5px',
  },
}

export const baseTemplate: ArticleModuleTemplate = {
  common: {
    container: {
      '&.first-card, &.last-card': {
        'h1': {
          fontSize: '10rem',
          fontFamily: 'Bold',
        },
        'h2': {
          fontSize: '8rem',
          fontWeight: 700,
        },
        'h3': {
          fontSize: '6rem',
        }
      },
      '&.middle-card': {
        'h1': {
          fontSize: '1rem', // text-base
        },
        'h2': {
          fontSize: '0.875rem', // text-sm
        },
        'h3': {
          fontSize: '1.125rem', // text-lg
        }
      }
    },
    title: {},
    content: commonTypography,
  },
  hero: {
    container: {
      fontFamily: 'unset',
      fontKerning: 'none',
      fontStyle: 'normal',
      fontSize: '18px',
      fontWeight: 400,
      fontSynthesis: 'none',
      color: '#333',
      contain: 'style',
      direction: 'ltr',
      height: 'auto',
      minHeight: '250px',
      padding: 0,
      letterSpacing: 0,
      lineHeight: '1.5',
      overflow: 'visible',
      overflowWrap: 'break-word',
      tabSize: 4,
      textAlign: 'left',
      textIndent: 0,
      textSizeAdjust: 'none',
      textTransform: 'none',
      whiteSpace: 'normal',
      wordBreak: 'normal',
    },
    title: {
      fontSize: '36px',
      fontWeight: 700,
      lineHeight: '1.2',
    },
    content: {
      fontSize: '20px',
    },
  },
  main: {
    container: {
      fontFamily: 'unset',
      fontKerning: 'none',
      fontStyle: 'normal',
      fontSize: '16px',
      fontWeight: 400,
      fontSynthesis: 'none',
      color: '#333',
      contain: 'style',
      direction: 'ltr',
      height: 'auto',
      padding: 0,
      letterSpacing: 0,
      lineHeight: '1.5',
      overflow: 'visible',
      overflowWrap: 'break-word',
      tabSize: 4,
      textAlign: 'left',
      textIndent: 0,
      textSizeAdjust: 'none',
      textTransform: 'none',
      whiteSpace: 'normal',
      wordBreak: 'normal',
    },
    title: {
      fontSize: '30px',
      fontWeight: 700,
      lineHeight: '1.2',
    },
    content: {
    },
  },
  sub: {
    container: {
      fontFamily: 'unset',
      fontKerning: 'none',
      fontStyle: 'normal',
      fontSize: '16px',
      fontWeight: 400,
      fontSynthesis: 'none',
      color: '#333',
      contain: 'style',
      direction: 'ltr',
      height: 'auto',
      padding: 0,
      marginTop: '15px',
      marginBottom: '15px',
      letterSpacing: 0,
      lineHeight: '1.5',
      overflow: 'visible',
      overflowWrap: 'break-word',
      tabSize: 4,
      textAlign: 'left',
      textIndent: 0,
      textSizeAdjust: 'none',
      textTransform: 'none',
      whiteSpace: 'normal',
      wordBreak: 'normal',
    },
    title: {
      fontSize: '20px',
      fontWeight: 700,
      lineHeight: '1.2',
    },
    content: {
    },
  },
}
