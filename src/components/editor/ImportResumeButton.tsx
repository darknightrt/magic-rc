"use client";
import { useTranslations } from "next-intl";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/store/useResumeStore";
import { toast } from "sonner";
import { generateUUID } from "@/utils/uuid";
import {
  initialResumeState,
  initialResumeStateEn,
} from "@/config/initialResumeData";

export function ImportResumeButton() {
  const t = useTranslations();
  const { addResume, setActiveResume } = useResumeStore();

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const content = await file.text();
        const config = JSON.parse(content);

        const locale =
          typeof document !== "undefined"
            ? document.cookie
                .split("; ")
                .find((row) => row.startsWith("NEXT_LOCALE="))
                ?.split("=")[1] || "zh"
            : "zh";

        const initialResumeData =
          locale === "en" ? initialResumeStateEn : initialResumeState;

        const newResume = {
          ...initialResumeData,
          ...config,
          id: generateUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const resumeId = addResume(newResume);
        setActiveResume(resumeId);
        toast.success(t("dashboard.resumes.importSuccess"));
      } catch (error) {
        console.error("Import error:", error);
        toast.error(t("dashboard.resumes.importError"));
      }
    };

    input.click();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleImport}
      className="flex items-center gap-2"
    >
      <Upload className="w-4 h-4" />
      <span className="hidden md:inline">导入</span>
    </Button>
  );
}

