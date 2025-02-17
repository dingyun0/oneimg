import { create } from "zustand";
import type {
  ArticleModuleTemplate,
  ThemeColorItem,
  ThemeConfig,
} from "@/types";
import {
  DEFAULT_TEMPLATE,
  DEFAULT_TEMPLATE_MAP,
  DEFAULT_THEME,
  DEFAULT_THEME_COLOR_MAP,
} from "@/theme";

interface TemplateStore {
  templateMap: Record<string, ThemeConfig[]>;
  templateName: string;
  theme: string;
  themeMap: Record<string, { label: string; theme: ThemeConfig }[]>;
  tabValue: string;
  setTabValue: (value: string) => void;
  setTemplateName: (templateName: string) => void;
  setTheme: (theme: string) => void;
  setTemplateMap: (templateMap: Record<string, ThemeConfig[]>) => void;
}

export const useThemeStore = create<TemplateStore>((set) => ({
  templateName: DEFAULT_TEMPLATE,
  theme: DEFAULT_THEME.label,
  templateMap: DEFAULT_TEMPLATE_MAP,
  themeMap: DEFAULT_THEME_COLOR_MAP,
  tabValue: "workspace",
  setTabValue: (value) => set({ tabValue: value }),
  setTemplateName: (templateName) => set({ templateName }),
  setTemplateMap: (templateMap) => set({ templateMap }),
  setTheme: (theme) => set({ theme }),
}));
