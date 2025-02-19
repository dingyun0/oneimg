import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { forwardRef, useContext, useMemo } from "react";
import { ImageList } from "./image-list";
import { baseTemplate } from "./styles";
import type { ContentWithId, ImageFile } from "@/types";
import {
  base64ToBlob,
  cn,
  createStyleClassMap,
  stripEmptyParagraphs,
} from "@/lib";
import { CustomThemeContext } from "@/contexts/custom-theme-context";

interface PreviewItemProps {
  content: ContentWithId;
  children?: React.ReactNode;
  index: number;
  childContentsMap: Map<number, ContentWithId[]>;
  position?: 'first' | 'last' | 'middle';
}

const sanitizeConfig = {
  ALLOWED_TAGS: ['br'], // 只允许换行标签
  KEEP_CONTENT: true
};

const Card = forwardRef<HTMLDivElement, PreviewItemProps>(
  ({ content, children, index, childContentsMap, position }, ref) => {
    const theme = useContext(CustomThemeContext);
    const uploadFiles = content.uploadFiles;
    const imageFiles: ImageFile[] =
      useMemo(() => {
        return uploadFiles?.map((file) => ({
          uid: file.uid,
          name: file.name,
          dataUrl: URL.createObjectURL(base64ToBlob(file.dataUrl, file.type!)),
          type: file.type,
        }));
      }, [uploadFiles]) || [];

    const templateClassNameMap = createStyleClassMap(
      theme?.template || {
        hero: {
        },
        main: {},
        sub: {},
        common: {}
      },
      "template",
      baseTemplate
    );

    // template
    const heroTemplate = templateClassNameMap.hero;
    const mainTemplate = templateClassNameMap.main;
    const subTemplate = templateClassNameMap.sub;

    const childContents = childContentsMap.get(content.id) || [];

    const cardStyle = useMemo(() => ({
      backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }), [content.backgroundImage]);

    // 清理 HTML 标签的函数
    const cleanContent = (html: string) => {
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['br'],
        KEEP_CONTENT: true
      }).replace(/&nbsp;/g, ' ');
    };

    return (
      <div
        id={`${content.id}`}
        className={cn(
          templateClassNameMap.common.container,
          content.parentId
            ? `${subTemplate.container}`
            : content.type === "theme_content"
            ? `${heroTemplate.container}`
            : `${mainTemplate.container}`,
          "flex flex-col justify-center"
        )}
        ref={ref}
        style={cardStyle}
      >
        {/* 只有当至少有一个标题存在时才显示标题容器 */}
        {(content.title || content.subTitle || content.subTitleContent) && (
          <div className="flex flex-col justify-center text-center">
            {content.title && (
              <h1 
                className={cn(
                  "flex items-center justify-center whitespace-pre-wrap leading-normal",
                  position === 'first' 
                    ? "text-[10rem]" 
                    : "text-base"
                )}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.title, sanitizeConfig) }}
              />
            )}
            {content.subTitle && (
              <h2 
                className={cn(
                  "mt-2 flex items-center justify-center whitespace-pre-wrap leading-normal",
                  position === 'first' 
                    ? "text-[8rem] font-bold"
                    : "text-sm font-semibold"
                )}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.subTitle, sanitizeConfig) }}
              />
            )}
            {content.subTitleContent && (
              <h3 
                className={cn(
                  "mt-1 flex items-center justify-center whitespace-pre-wrap leading-normal",
                  position === 'first' 
                    ? "text-[6rem]"
                    : "text-lg"
                )}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.subTitleContent, sanitizeConfig) }}
              />
            )}
          </div>
        )}

        {/* 只有当有内容或图片时才显示内容容器 */}
        {(stripEmptyParagraphs(content.content) || imageFiles.length > 0) && (
          <div
            className={cn(
              templateClassNameMap.common.content,
              content.parentId
                ? `${subTemplate.content}`
                : content.type === "theme_content"
                ? `${heroTemplate.content}`
                : `${mainTemplate.content}`,
              "flex flex-col justify-center text-center",
              (content.title || content.subTitle || content.subTitleContent) &&
                "mt-4"
            )}
          >
            {content.content && (
              <div className={cn("flex flex-col items-center justify-center",
                position==='first'?'text-base':'text-xs'
            )}>
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(content.content, {
                      ALLOWED_TAGS: ['br'],
                      KEEP_CONTENT: true
                    })
                  }} 
                />
              </div>
            )}
            {imageFiles.length > 0 && <ImageList images={imageFiles} />}
          </div>
        )}

        {/* 子内容 */}
        {childContents.length > 0 && (
          <div
            className={cn(
              "flex flex-col items-center",
              // 只有当有其他内容时才添加上边距
              (content.title ||
                content.subTitle ||
                content.subTitleContent ||
                content.content ||
                imageFiles.length > 0) &&
                "mt-4"
            )}
          >
            {childContents.map((childContent) => (
              <Card
                key={childContent.id}
                content={childContent}
                index={index}
                position={position}
                childContentsMap={childContentsMap}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
Card.displayName = "Card";

export { Card };
