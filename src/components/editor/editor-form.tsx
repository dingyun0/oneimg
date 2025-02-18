"use client";
import { useEffect, useReducer, useRef, useState } from "react";
import { EditorContainer } from "./editor-container";
import EditorImage from "./editor-image";
import EditorButton from "./editor-button";
import { cn } from "@/lib/utils";
import type {
  ActionType,
  Content,
  EditorMethods,
  ImageFile,
} from "@/types/common";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus } from 'lucide-react'

type EditorProps = {
  className?: string;
  initialContent?: Content;
  titlePlaceholder?: string;
  contentPlaceholder?: string;
  quality?: number;
  outputFormat?: string;
  multiple: boolean;
  onSubmit: (content: Content) => Promise<void>;
  hideEditor: () => void;
};

type ContentAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_SUBTITLE"; payload: string }
  | { type: "SET_SUBTITLE_CONTENT"; payload: string }
  | { type: "SET_CONTENT"; payload?: string }
  | { type: "SET_UPLOAD_FILES"; payload: ImageFile[] }
  | { type: "SET_BACKGROUND_IMAGE"; payload: string }
  | { type: "RESET" };

const contentReducer = (state: Content, action: ContentAction): Content => {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_SUBTITLE":
      return { ...state, subTitle: action.payload };
    case "SET_SUBTITLE_CONTENT":
      return { ...state, subTitleContent: action.payload };
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "SET_UPLOAD_FILES":
      return { ...state, uploadFiles: action.payload };
    case "SET_BACKGROUND_IMAGE":
      return { ...state, backgroundImage: action.payload };
    case "RESET":
      return {
        title: "",
        subTitle: "",
        subTitleContent: "",
        content: "",
        uploadFiles: [],
        backgroundImage: "",
      };
    default:
      return state;
  }
};

export default function EditorForm(props: EditorProps) {
  const {
    onSubmit,
    hideEditor,
    className,
    initialContent,
    titlePlaceholder,
    contentPlaceholder,
    quality,
    outputFormat,
    multiple,
  } = props;
  const initialState = {
    title: "",
    content: "",
    uploadFiles: [],
  };
  const [content, dispatch] = useReducer(
    contentReducer,
    initialContent || initialState
  );
  const editorRef = useRef<EditorMethods>(null);
  const [disabled, setDisabled] = useState(true);

  // initialize save button disabled state
  useEffect(() => {
    setDisabled(!!editorRef.current?.isEmpty());
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const newContent = {
        ...content,
        title: content.title as string,
        subTitle: content.subTitle,
        subTitleContent: content.subTitleContent,
        content: content.content,
        uploadFiles: content.uploadFiles,
        parentId: content.parentId ? content.parentId : null,
        backgroundImage: content.backgroundImage,
      } as Content;

      await onSubmit(newContent);
      dispatch({ type: "RESET" });
      if (editorRef.current) {
        editorRef.current.reset();
        setDisabled(true);
      }

      // 如果是编辑，需要隐藏编辑器
      if (newContent.id) {
        hideEditor();
      }
    } catch (error) {
      toast({
        title: "提交失败",
        description: "请重试",
      });
    }
  }

  function handleFilesChange(files?: ImageFile[]) {
    dispatch({ type: "SET_UPLOAD_FILES", payload: files || [] });
  }

  const handleContentUpdate = (newContent: Content, actionType: ActionType) => {
    setDisabled(!!editorRef.current?.isEmpty());

    if (actionType === "SET_TITLE") {
      dispatch({ type: "SET_TITLE", payload: newContent.title });
      dispatch({ type: "SET_SUBTITLE", payload: newContent.subTitle || "" });
      dispatch({
        type: "SET_SUBTITLE_CONTENT",
        payload: newContent.subTitleContent || "",
      });
    }

    if (actionType === "SET_CONTENT") {
      dispatch({ type: "SET_CONTENT", payload: newContent.content });
    }
  };

  async function handleBackgroundUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const backgroundImageUrl = reader.result as string;
        dispatch({ type: "SET_BACKGROUND_IMAGE", payload: backgroundImageUrl });
      };
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("editor-container", className)}>
      <div className="border rounded-[6px] p-3 overflow-auto bg-white">
        <EditorContainer
          titlePlaceholder={titlePlaceholder}
          contentPlaceholder={contentPlaceholder}
          initialContent={content}
          onContentUpdate={handleContentUpdate}
          ref={editorRef}
        />

        <div className="flex items-center gap-2 mt-4 mb-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleBackgroundUpload}
            className="hidden"
            id="card-background"
          />
          <label htmlFor="card-background">
            <Button variant="outline" size="sm" type="button" asChild>
              <span>
                <ImagePlus className="w-4 h-4 mr-2" />
                设置卡片背景
              </span>
            </Button>
          </label>
          {content.backgroundImage && (
            <span className="text-sm text-muted-foreground">
              已选择背景图片
            </span>
          )}
        </div>

        <div className="editor-footer">
          <EditorImage
            onFilesChange={handleFilesChange}
            uploadFiles={content.uploadFiles}
          />
          <EditorButton
            multiple={multiple}
            setImage={editorRef.current?.setImage}
            hideEditor={hideEditor}
            onFilesChange={handleFilesChange}
            disabled={disabled}
            uploadFiles={content.uploadFiles}
            quality={quality}
            outputFormat={outputFormat}
          />
        </div>
      </div>
    </form>
  );
}
