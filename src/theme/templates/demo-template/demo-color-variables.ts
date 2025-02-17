import type { ThemeConfig } from '@/types'
import { url } from 'inspector'

// 蓝色主题
export const demoBlue: ThemeConfig = {
  hero: {
    container: {
      foreground: '#1a365d',
      backgroundImage: 'url(https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png)',
    },
    title: {
      foreground: '#2b4c7e',
      background: 'transparent',
    },
    content: {
      foreground: '#334155',
      background: 'transparent',
    },
  },
  main: {
    container: {
      margin: '20px',
      foreground: '#1a365d',
      background: '#ffffff',
    },
    title: {
      foreground: '#2b4c7e',
      background: '#e6f0ff',
    },
    content: {
      foreground: '#334155',
      background: '#ffffff',
    },
  },
  sub: {
    container: {
      foreground: '#1a365d',
      background: '#f8fafc',
    },
    title: {
      foreground: '#2b4c7e',
      background: '#f0f7ff',
    },
    content: {
      foreground: '#334155',
      background: 'transparent',
    },
  },
}

// 绿色主题
export const demoGreen: ThemeConfig = {
  hero: {
    container: {
      background: '#f0fff4',
      foreground: '#1a4731',
    },
    title: {
      foreground: '#276749',
      background: 'transparent',
    },
    content: {
      foreground: '#2f855a',
      background: 'transparent',
    },
  },
  main: {
    container: {
      foreground: '#1a4731',
      background: '#ffffff',
    },
    title: {
      foreground: '#276749',
      background: '#e6ffec',
    },
    content: {
      foreground: '#2f855a',
      background: '#ffffff',
    },
  },
  sub: {
    container: {
      foreground: '#1a4731',
      background: '#f8faf9',
    },
    title: {
      foreground: '#276749',
      background: '#f0fff4',
    },
    content: {
      foreground: '#2f855a',
      background: 'transparent',
    },
  },
} 