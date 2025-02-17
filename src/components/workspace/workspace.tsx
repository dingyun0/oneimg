import { useState } from "react";
import { FolderPlus, PlusIcon, ImageIcon } from "lucide-react";
import { ThemeFormDialog } from "@/components/workspace/theme-form-dialog";
import EditorForm from "@/components/editor/editor-form";
import ContentList from "@/components/workspace/content-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Content, ContentWithId, ThemeContent } from "@/types/common";
import { useEditorStore } from "@/store/use-editor-store";

interface WorkspaceProps {
  contents: ContentWithId[];
  setContents: (contents: ContentWithId[]) => void;
  onContentSubmit: (content: Content) => Promise<void>;
  onThemeContentSubmit: (content: ThemeContent) => Promise<void>;
  onContentDelete: (content: ContentWithId) => Promise<void>;
}

export function Workspace(props: WorkspaceProps) {
  const {
    contents,
    setContents,
    onContentSubmit,
    onContentDelete,
    onThemeContentSubmit,
  } = props;
  const { editorType, setEditorType, setEditingContentId } = useEditorStore();
  const [open, setOpen] = useState(false);

  async function handleBackgroundUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const backgroundImageUrl = reader.result as string;
        const oneList = document.getElementsByClassName("one-list");
        if (oneList.length > 0) {
          (
            oneList[0] as HTMLElement
          ).style.backgroundImage = `url(${backgroundImageUrl})`;
        }
      };
    }
  }

  return (
    <div
      className={cn(
        "w-full flex flex-col p-4 sm:p-8 min-h-full",
        contents.length === 0 && "justify-center"
      )}
    >
      {contents.length > 0 && (
        <>
          <div className="mb-4 flex justify-end">
            <Input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="hidden"
              id="background-upload"
            />
            <label htmlFor="background-upload">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  更换背景
                </span>
              </Button>
            </label>
          </div>
          <ContentList
            contents={contents}
            setContents={setContents}
            onContentDelete={onContentDelete}
            onSubmit={onContentSubmit}
          />
          {editorType === "add" ? (
            <EditorForm
              multiple
              onSubmit={onContentSubmit}
              hideEditor={() => setEditorType("close")}
              className="ml-6"
            />
          ) : (
            <Button
              className={cn("w-full")}
              onClick={() => {
                // escape editing
                setEditingContentId(null);
                setEditorType("add");
              }}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              添加标题
            </Button>
          )}
        </>
      )}
      {contents.length === 0 && (
        <>
          <div className="flex flex-col gap-2 justify-center items-center w-full h-full max-w-sm mx-auto text-muted-foreground">
            <p>从新建项目开始</p>
            <p>您的所有数据都存储在浏览器本地。</p>
            <Button
              className="sm:w-[256px] mt-4"
              variant="outline"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              新建项目
            </Button>
          </div>
          <ThemeFormDialog
            onOpenChange={setOpen}
            onSubmit={onThemeContentSubmit}
            open={open}
          />
        </>
      )}
    </div>
  );
}
