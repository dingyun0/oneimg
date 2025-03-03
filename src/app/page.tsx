"use client";
import { useEffect, useRef, useState } from "react";
import { GlobalStyles } from "tss-react";
import {
  CACHE_KEY_TEMPLATE,
  CACHE_KEY_THEME,
  addContent,
  cn,
  deleteContent,
  generateThemeVariables,
  getContents,
  updateContent,
} from "@/lib";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Workspace } from "@/components/workspace/workspace";
import { Header } from "@/components/header/header";
import { Preview } from "@/components/preview/preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { ArticleModuleTemplate, Content, ContentWithId, PreviewRef, ThemeContent } from "@/types";
import { DEFAULT_TEMPLATE, DEFAULT_THEME } from "@/theme";
import { CustomThemeContext } from "@/contexts/custom-theme-context";
import { useThemeStore } from "@/store/use-theme-store";

export default function Home() {
  const [contents, setContents] = useState<ContentWithId[]>([]);
  const {
    templateName,
    setTemplateName,
    theme,
    setTheme,
    templateMap,
    themeMap,
    tabValue,
    setTabValue,
  } = useThemeStore();
  const [cssVariables, setCssVariables] = useState({});
  const { toast } = useToast();
  const previewRef = useRef<PreviewRef>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentTemplate =
        localStorage.getItem(CACHE_KEY_TEMPLATE) || DEFAULT_TEMPLATE;
      setTemplateName(currentTemplate);

      const currentTheme =
        localStorage.getItem(CACHE_KEY_THEME) || DEFAULT_THEME.label;
      setTheme(currentTheme);
    }
  }, [setTemplateName, setTheme]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await getContents();
        setContents(data);
      } catch (error) {
        toast({
          title: "加载失败",
          description: "请刷新后重试",
          duration: 1000,
        });
      }
    };

    fetchContents();
  }, [toast]);



  async function handleThemeContentSubmit(themeContent: ThemeContent) {
    try {
      if ("id" in themeContent) {
        const updatedContent = {
          ...themeContent,
          type: "theme_content",
        } as ContentWithId;
        await updateContent(updatedContent);
        setContents(
          contents.map((item) =>
            item.id === updatedContent.id ? updatedContent : item
          )
        );
      } else {
        const newContent = {
          ...themeContent,
          type: "theme_content",
        } as Content;
        const id = await addContent(newContent);
        setContents((prevContents) => [...prevContents, { ...newContent, id }]);
        setTemplateName(themeContent.template);
        setTheme(themeContent.theme);
        window.localStorage.setItem("currentTemplate", themeContent.template);
      }
    } catch (error) {
      toast({
        title: "添加失败",
        description: "请重试",
      });
    }
  }

  async function handleContentSubmit(content: Content) {
    try {
      if ("id" in content) {
        await updateContent(content as ContentWithId);
        setContents(
          contents.map((item) =>
            item.id === content.id ? (content as ContentWithId) : item
          )
        );
      } else {
        const newContent = {
          ...content,
          type: "normal_content",
        } as Content;
        const id = await addContent(newContent);
        setContents((prevContents) => [...prevContents, { ...newContent, id }]);
      }
    } catch (error) {
      toast({
        title: "添加失败",
        description: "请重试",
      });
    }
  }

  async function handleContentDelete(content: ContentWithId) {
    try {
      await deleteContent(content.id);
      const newContents = contents.filter((item) => item.id !== content.id);
      setContents(newContents);

      // 如果删除的是主题内容（项目），重置背景图片
      if (content.type === "theme_content") {
        // 重置 CSS 变量
        document.documentElement.style.setProperty(
          "--one-list-background-image",
          "none"
        );

        // 重置 DOM 元素的 style
        const oneList = document.getElementsByClassName("one-list");
        if (oneList.length > 0) {
          (oneList[0] as HTMLElement).style.backgroundImage = "none";
        }
      }

      toast({
        title: "删除成功",
        duration: 1000,
      });
    } catch (error) {
      toast({
        title: "删除失败",
        description: "请重试",
        duration: 1000,
      });
    }
  }

  async function handeleContentsUndo(deletedContents: Content[]) {
    try {
      for (const content of deletedContents) {
        await addContent(content);
      }
      setContents(contents);
    } catch (error) {
      toast({
        title: "撤销失败",
        description: "",
      });
    }
  }

  return (
    <CustomThemeContext.Provider
      value={{ theme, template: templateMap[templateName] as ArticleModuleTemplate }}
    >
      <GlobalStyles styles={{ ":root": cssVariables }} />
      <div className="flex flex-col h-full">
        <Header
          contents={contents}
          setContents={setContents}
          previewRef={previewRef}
          templateName={templateName}
          setTemplateName={setTemplateName}
          theme={theme}
          setTheme={setTheme}
          setTableValue={setTabValue}
        />
        <main className="h-[calc(100%-58px)]">
          <Tabs
            defaultValue="workspace"
            value={tabValue}
            onValueChange={setTabValue}
            className="h-full flex flex-col sm:flex-row"
          >
            <TabsList className="grid w-full grid-cols-2 sm:hidden">
              <TabsTrigger value="workspace">编辑器</TabsTrigger>
              <TabsTrigger value="preview">预览</TabsTrigger>
            </TabsList>
            <TabsContent
              value="preview"
              forceMount
              className="data-[state=inactive]:hidden sm:data-[state=inactive]:block h-full"
            >
              <div
                className={cn(
                  "one scroll-smooth h-full mx-auto w-[375px] overflow-hidden"
                )}
              >
                <Preview
                  ref={previewRef}
                  contents={contents}
                  className="w-full flex flex-col m-auto"
                />
              </div>
            </TabsContent>
            <TabsContent
              value="workspace"
              forceMount
              className="data-[state=inactive]:hidden sm:flex-grow sm:!block overflow-auto"
            >
              <div className="h-full flex-grow flex justify-center items-start bg-card text-card-foreground">
                <Workspace
                  contents={contents}
                  setContents={setContents}
                  onContentSubmit={handleContentSubmit}
                  onContentDelete={handleContentDelete}
                  onThemeContentSubmit={handleThemeContentSubmit}
                />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </CustomThemeContext.Provider>
  );
}
