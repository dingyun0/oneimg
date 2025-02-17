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
    case "RESET":
      return {
        title: "",
        subTitle: "",
        subTitleContent: "",
        content: "",
        uploadFiles: [],
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
