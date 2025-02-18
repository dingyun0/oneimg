"use client";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Image from "@tiptap/extension-image";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import History from "@tiptap/extension-history";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Blockquote from "@tiptap/extension-blockquote";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import { EditorContent, useEditor } from "@tiptap/react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { TrailingNode } from "./tailing-node";
import { EditorBubbleMenu } from "./editor-bubble-menu";
import type { ActionType, Content, EditorMethods } from "@/types/common";
import { cn } from "@/lib/utils";

type EditorProps = {
  initialContent?: Content;
  onContentUpdate: (content: Content, actionType: ActionType) => void;
  titlePlaceholder?: string;
  subTitlePlaceholder?: string;
  subTitleContentPlaceholder?: string;
  contentPlaceholder?: string;
};

const EditorContainer = forwardRef<EditorMethods, EditorProps>(
  (
    {
      initialContent,
      onContentUpdate,
      titlePlaceholder,
      subTitlePlaceholder,
      subTitleContentPlaceholder,
      contentPlaceholder,
    }: EditorProps,
    ref
  ) => {
    // 大标题编辑器
    const titleEditor = useEditor({
      extensions: [
        Document,
        Paragraph,
        Text,
        HardBreak,
        Placeholder.configure({
          placeholder: titlePlaceholder || "大标题（可选）",
        }),
        History,
      ],
      content: initialContent?.title || "",
      editorProps: {
        attributes: {
          class: "focus:outline-none max-w-full font-bold text-xl mb-4",
        },
      },
      immediatelyRender: true,
    });

    // 小标题编辑器
    const subTitleEditor = useEditor({
      extensions: [
        Document,
        Paragraph,
        Text,
        HardBreak,
        Placeholder.configure({
          placeholder: subTitlePlaceholder || "小标题（可选）",
        }),
        History,
      ],
      content: initialContent?.subTitle || "",
      editorProps: {
        attributes: {
          class: "focus:outline-none max-w-full font-semibold text-lg mb-2",
        },
      },
      immediatelyRender: true,
    });

    // 小标题文案编辑器
    const subTitleContentEditor = useEditor({
      extensions: [
        Document,
        Paragraph,
        Text,
        HardBreak,
        Placeholder.configure({
          placeholder: subTitleContentPlaceholder || "小标题文案（可选）",
        }),
        History,
      ],
      content: initialContent?.subTitleContent || "",
      editorProps: {
        attributes: {
          class: "focus:outline-none max-w-full text-base mb-4",
        },
      },
      immediatelyRender: true,
    });

    // 正文编辑器
    const contentEditor = useEditor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Italic,
        Bold,
        Underline,
        BulletList,
        OrderedList,
        ListItem,
        HardBreak,
        HorizontalRule,
        Blockquote,
        Code,
        CodeBlock,
        Placeholder.configure({
          placeholder: contentPlaceholder || "正文",
        }),
        TrailingNode,
        Image.configure({
          inline: false,
          allowBase64: true,
        }),
        History,
      ],

      content: initialContent?.content || "",
      editorProps: {
        attributes: {
          class: "focus:outline-none max-w-full text-sm",
        },
      },
      immediatelyRender: false,
    });

    // 使用 useImperativeHandle 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      reset() {
        titleEditor?.commands.clearContent();
        subTitleEditor?.commands.clearContent();
        subTitleContentEditor?.commands.clearContent();
        contentEditor?.commands.clearContent();
      },
      isEmpty() {
        return (
          !titleEditor ||
          (titleEditor.isEmpty &&
            subTitleEditor?.isEmpty &&
            subTitleContentEditor?.isEmpty &&
            contentEditor?.isEmpty)
        ) ;
      },
      setImage(url: string) {
        if (contentEditor) {
          contentEditor.chain().focus().setImage({ src: url }).run();
        }
      },
    }));

    // 当编辑器内容变化，触发编辑器 update 事件
    useEffect(() => {
      if (
        titleEditor &&
        subTitleEditor &&
        subTitleContentEditor &&
        contentEditor
      ) {
        // 标题相关编辑器的更新处理
        const updateTitleContent = () => {
          onContentUpdate(
            {
              title: titleEditor.getHTML(),
              subTitle: subTitleEditor.getHTML(),
              subTitleContent: subTitleContentEditor.getHTML(),
              content: contentEditor.getHTML(),
            },
            "SET_TITLE"
          );
        };

        // 正文编辑器的更新处理
        const updateMainContent = () => {
          onContentUpdate(
            {
              title: titleEditor.getHTML(),
              subTitle: subTitleEditor.getHTML(),
              subTitleContent: subTitleContentEditor.getHTML(),
              content: contentEditor.getHTML(),
            },
            "SET_CONTENT"
          );
        };

        // 为不同的编辑器绑定不同的更新处理函数
        titleEditor.on("update", updateTitleContent);
        subTitleEditor.on("update", updateTitleContent);
        subTitleContentEditor.on("update", updateTitleContent);
        contentEditor.on("update", updateMainContent);

        // 清理函数
        return () => {
          titleEditor.off("update", updateTitleContent);
          subTitleEditor.off("update", updateTitleContent);
          subTitleContentEditor.off("update", updateTitleContent);
          contentEditor.off("update", updateMainContent);
        };
      }
    }, [
      titleEditor,
      subTitleEditor,
      subTitleContentEditor,
      contentEditor,
      onContentUpdate,
    ]);

    return (
      <div className={cn("mb-6 flex flex-col gap-1 editor-content")}>
        <EditorContent editor={titleEditor} />
        <EditorContent editor={subTitleEditor} />
        <EditorContent editor={subTitleContentEditor} />
        {contentEditor && <EditorBubbleMenu editor={contentEditor} />}
        <EditorContent editor={contentEditor} />
      </div>
    );
  }
);

EditorContainer.displayName = "EditorContainer";
export { EditorContainer };
