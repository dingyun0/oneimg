import { tss } from 'tss-react'
import type { ArticleModuleTemplate, ModuleClassNameMap, ModuleSection, ThemeConfig } from '@/types'

export const createStyle = (classNamePrefix: string) => {
  return tss
    .withParams<{ defaultStyles?: ModuleSection, templateStyles?: ModuleSection }>()
    .withName(classNamePrefix)
    .create(({ defaultStyles = {}, templateStyles = {} }) => ({
      container: {
        ...defaultStyles.container,
        ...templateStyles.container,
      },
      title: {
        ...defaultStyles.title,
        ...templateStyles.title,
      },
      content: {
        ...defaultStyles.content,
        ...templateStyles.content,
      },
    }))
}

const defaultTemplateStructure = {
  hero: {},
  main: {},
  sub: {},
  common: {}
};

export function createStyleClassMap(
  templateStyles: ArticleModuleTemplate = defaultTemplateStructure,
  prefix: string,
  baseStyles: ArticleModuleTemplate
) {
  const mergedTemplateStyles = {
    ...defaultTemplateStructure,
    ...templateStyles
  };

  const { classes: heroClasses } = createStyle(`${prefix}-hero`)({
    defaultStyles: baseStyles.hero ?? {},
    templateStyles: mergedTemplateStyles.hero,
  })

  const { classes: mainClasses } = createStyle(`${prefix}-main`)({
    defaultStyles: baseStyles.main ?? {},
    templateStyles: mergedTemplateStyles.main,
  })

  const { classes: subClasses } = createStyle(`${prefix}-sub`)({
    defaultStyles: baseStyles.sub ?? {},
    templateStyles: mergedTemplateStyles.sub,
  })

  const { classes: defaultClasses } = createStyle(`${prefix}-common`)({
    defaultStyles: baseStyles.common ?? {},
    templateStyles: mergedTemplateStyles.common,
  })

  const templateClassNameMap: ModuleClassNameMap = {
    common: defaultClasses,
    hero: heroClasses,
    main: mainClasses,
    sub: subClasses,
  }
  return templateClassNameMap
}

// export function generateThemeVariables(theme: ThemeConfig): string {
//   const cssVariables = flattenThemeConfig(theme, '', {})
//   return `
//     :root {
//       ${Object.entries(cssVariables)
//       .map(([key, value]) => `${key}: ${value};`)
//       .join('\n')}
//     }
//   `
// }

export function generateThemeVariables(theme: ThemeConfig): Record<string, any> {
  return flattenThemeConfig(theme, '', {})
}

export function flattenThemeConfig(
  obj: Record<string, any>,
  parentKey = '',
  result: Record<string, any>,
) {
  for (const key in obj) {
    const kebabKey = camelToKebab(key)
    const newKey = parentKey ? `${parentKey}-${kebabKey}` : `--${kebabKey}`
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenThemeConfig(obj[key], newKey, result)
    } else {
      result[newKey] = obj[key]
    }
  }

  return result
}

export function camelToKebab(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
