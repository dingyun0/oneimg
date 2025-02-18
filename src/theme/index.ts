import {
  cartoonBlue,
  cartoonGreen,
  cartoonPurple,
  cartoonTemplate,
  cartoonYellow,
  simpleSnowBlack,
  simpleSnowWhite,
  simpleTemplate,
  techBlue,
  techRoseRed,
  techTemplate,
  techVibrantOrange,
  demoBlue,
  demoGreen,
  demoTemplate,
} from './templates'
import type { ArticleModuleTemplate, ThemeColorItem } from '@/types'

export const DEFAULT_TEMPLATES = [
  { label: '保时捷公众号模板', value: 'demo-style', disabled: false, template: demoTemplate },
  { label: '更多模版尽情期待', value: 'post-more', disabled: true, template: null },
] as const

export const DEFAULT_TEMPLATE_MAP = DEFAULT_TEMPLATES
  .filter(item => !item.disabled)
  .reduce((acc, cur) => {
    const { value, template } = cur
    acc[value] = template
    return acc
  }, {} as Record<string, ArticleModuleTemplate>)

export const DEFAULT_THEME_COLOR_MAP: Record<string, ThemeColorItem[]> = {
  'wechat-post-1': [
    { value: '#4383ec', label: 'tech_blue', theme: techBlue },
    { value: '#ff611d', label: 'vibrant_orange', theme: techVibrantOrange },
    { value: '#f14040', label: 'rose_red', theme: techRoseRed },
  ],
  'apple-style': [
    { value: '#ddd', label: 'snow_white', theme: simpleSnowWhite },
    { value: '#000', label: 'midnight_black', theme: simpleSnowBlack },
  ],
  'cartoon-style': [
    { value: '#b38aef', label: 'purple', theme: cartoonPurple },
    { value: '#cdea9c', label: 'green', theme: cartoonGreen },
    { value: '#ffe97f', label: 'yellow', theme: cartoonYellow },
    { value: '#516cf5', label: 'blue', theme: cartoonBlue },
  ],
  'default': [
    { value: '#4383ec', label: 'tech_blue', theme: techBlue },
    { value: '#ff611d', label: 'vibrant_orange', theme: techBlue },
    { value: '#f14040', label: 'rose_red', theme: techBlue },
  ],
  'demo-style': [
    { value: '#2b4c7e', label: 'demo_blue', theme: demoBlue },
    { value: '#276749', label: 'demo_green', theme: demoGreen },
  ],
}

export const DEFAULT_TEMPLATE = 'demo-style'
export const DEFAULT_THEME = {
  label: 'snow_white',
  value: '#ddd',
}
