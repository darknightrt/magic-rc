import React from "react";
import {
  BasicInfo,
  CustomFieldType,
  getBorderRadiusValue,
  GlobalSettings,
  MenuSection,
  ResumeData,
} from "@/types/resume";
import { ResumeTemplate } from "@/types/template";
import ExperienceSection from "@/components/preview/ExperienceSection";
import EducationSection from "@/components/preview/EducationSection";
import ProjectSection from "@/components/preview/ProjectSection";
import SkillSection from "@/components/preview/SkillPanel";
import CustomSection from "@/components/preview/CustomSection";
import GithubContribution from "@/components/shared/GithubContribution";

interface DemoThreeTemplateProps {
  data: ResumeData;
  template: ResumeTemplate;
}

const DemoThreeTemplate: React.FC<DemoThreeTemplateProps> = ({
  data,
  template,
}) => {
  const accentColor =
    data.globalSettings?.themeColor || template.colorScheme.primary;
  const secondaryColor = template.colorScheme.secondary;
  const pagePadding =
    data.globalSettings?.pagePadding ?? template.spacing.contentPadding;
  const sectionSpacing =
    data.globalSettings?.sectionSpacing ?? template.spacing.sectionGap;
  const paragraphSpacing =
    data.globalSettings?.paragraphSpacing ?? template.spacing.itemGap;
  const headerFontSize = (data.globalSettings?.headerSize ?? 28) + 6;
  const subheaderFontSize = data.globalSettings?.subheaderSize ?? 18;
  const textColor = "#0f172a";
  const labelColor = "#0c275c";
  const goldAccent = "#c99a3b";

  const enabledSections = data.menuSections.filter((section) => section.enabled);
  const sortedSections = [...enabledSections].sort((a, b) => a.order - b.order);
  const nonBasicSections = sortedSections.filter(
    (section) => section.id !== "basic"
  );

  const mainSectionIds = ["experience", "projects", "education"];
  const primarySections: MenuSection[] = [];
  const secondarySections: MenuSection[] = [];

  nonBasicSections.forEach((section) => {
    if (mainSectionIds.includes(section.id)) {
      primarySections.push(section);
    } else {
      secondarySections.push(section);
    }
  });

  const sharedSectionSettings: GlobalSettings = {
    ...data.globalSettings,
    paragraphSpacing,
    sectionSpacing: 0,
  };

  const locale =
    typeof window !== "undefined" && window.navigator?.language
      ? window.navigator.language
      : "zh-CN";

  const formatDate = (value?: string) => {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
      }).format(new Date(value));
    } catch (error) {
      return value;
    }
  };

  const collectBasicFields = (basic: BasicInfo) => {
    const fallbackFields = [
      { key: "email", label: "Email", value: basic.email },
      { key: "phone", label: "Phone", value: basic.phone },
      { key: "location", label: "Location", value: basic.location },
    ];

    const orderedFields = basic.fieldOrder
      ? basic.fieldOrder
          .filter(
            (field) =>
              field.visible !== false &&
              field.key !== "name" &&
              field.key !== "title"
          )
          .map((field) => {
            const rawValue =
              field.key === "birthDate"
                ? formatDate(basic[field.key] as string)
                : ((basic as BasicInfo)[field.key] as string);

            return {
              key: field.key,
              label: field.label,
              value: rawValue,
            };
          })
          .filter((field) => field.value)
      : fallbackFields.filter((field) => field.value);

    const customFields: CustomFieldType[] =
      basic.customFields?.filter((field) => field.visible !== false) || [];

    return [
      ...orderedFields,
      ...customFields.map((field) => ({
        key: field.id,
        label: field.label,
        value: field.value,
      })),
    ].filter((field) => field.value);
  };

  const contactFields = collectBasicFields(data.basic);

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case "experience":
        return (
          <ExperienceSection
            experiences={data.experience}
            globalSettings={sharedSectionSettings}
            showTitle={false}
          />
        );
      case "education":
        return (
          <EducationSection
            education={data.education}
            globalSettings={sharedSectionSettings}
            showTitle={false}
          />
        );
      case "projects":
        return (
          <ProjectSection
            projects={data.projects}
            globalSettings={sharedSectionSettings}
            showTitle={false}
          />
        );
      case "skills":
        return (
          <SkillSection
            skill={data.skillContent}
            globalSettings={sharedSectionSettings}
            showTitle={false}
          />
        );
      default:
        if (sectionId in data.customData) {
          const sectionTitle =
            data.menuSections.find((section) => section.id === sectionId)
              ?.title || sectionId;
          return (
            <CustomSection
              sectionId={sectionId}
              title={sectionTitle}
              items={data.customData[sectionId]}
              globalSettings={sharedSectionSettings}
              showTitle={false}
            />
          );
        }
        return null;
    }
  };

  const SectionBlock = ({ section }: { section: MenuSection }) => {
    const sectionTitle =
      data.menuSections.find((item) => item.id === section.id)?.title ||
      section.id;

    return (
      <div
        key={section.id}
        className="space-y-3"
        style={{ marginBottom: `${sectionSpacing}px` }}
      >
        <div
          className="inline-flex items-center rounded-full px-5 py-1 text-white uppercase tracking-[0.3em]"
          style={{
            backgroundColor: labelColor,
            fontSize: Math.max(subheaderFontSize - 6, 12),
          }}
        >
          {sectionTitle}
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white/95 p-5 shadow-sm">
          {renderSectionContent(section.id)}
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    const photoVisible = data.basic.photo && data.basic.photoConfig?.visible;

    return (
      <div className="overflow-hidden rounded-t-[36px] bg-white shadow-md">
        <div
          className="h-3 w-full"
          style={{
            backgroundColor: goldAccent,
          }}
        />

        <div className="px-8 py-10">
          <div className="flex flex-col items-center gap-8 text-center text-slate-800 lg:flex-row lg:items-center lg:justify-between lg:text-left">
            <div className="flex-1 space-y-5">
              {data.basic.employementStatus && (
                <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
                  {data.basic.employementStatus}
                </span>
              )}
              <div className="space-y-2">
                <h1
                  className="font-bold tracking-wide"
                  style={{
                    fontSize: `${headerFontSize}px`,
                    color: labelColor,
                    textAlign: "center",
                  }}
                >
                  {data.basic.name || "您的姓名"}
                </h1>
                {data.basic.title && (
                  <p
                    className="font-semibold text-slate-600"
                    style={{
                      fontSize: `${subheaderFontSize}px`,
                      textAlign: "center",
                    }}
                  >
                    {data.basic.title}
                  </p>
                )}
              </div>

              {data.basic.summary && (
                <p className="text-sm leading-relaxed text-slate-600">
                  {data.basic.summary}
                </p>
              )}

              {contactFields.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 lg:justify-center">
                  {contactFields.map((field) => (
                    <div
                      key={field.key}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600"
                    >
                      <span className="text-slate-400">{field.label}：</span>
                      <span className="text-slate-700">{field.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {photoVisible && (
              <div className="flex justify-center">
                <div
                  className="rounded-3xl border-4 border-white shadow-lg"
                  style={{
                    width: data.basic.photoConfig?.width || 140,
                    height: data.basic.photoConfig?.height || 180,
                    borderRadius: getBorderRadiusValue(data.basic.photoConfig),
                    overflow: "hidden",
                    backgroundColor: "#f3f4f6",
                    boxShadow: "0 20px 40px rgba(15,23,42,0.15)",
                  }}
                >
                  <img
                    src={data.basic.photo}
                    alt={`${data.basic.name || "avatar"} photo`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-full min-h-screen"
      style={{
        backgroundColor: "#e9edf5",
        color: textColor,
      }}
    >
      <div
        className="mx-auto max-w-full"
        style={{
          padding: `${pagePadding}px`,
        }}
      >
        <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-gradient-to-b from-white via-white to-[#f4f6fb] shadow-2xl">
          {renderHeader()}

          <div className="px-10 py-12">
            <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
              <div className="space-y-8">
                {primarySections.map((section) => (
                  <SectionBlock key={section.id} section={section} />
                ))}
              </div>

              <div className="space-y-8">
                {secondarySections.map((section) => (
                  <SectionBlock key={section.id} section={section} />
                ))}

                {data.basic.githubContributionsVisible && (
                  <div
                    className="space-y-3"
                    style={{ marginTop: `${sectionSpacing}px` }}
                  >
                    <div
                      className="inline-flex items-center rounded-full px-5 py-1 text-white uppercase tracking-[0.3em]"
                      style={{
                        backgroundColor: labelColor,
                        fontSize: Math.max(subheaderFontSize - 6, 12),
                      }}
                    >
                      GitHub
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white/95 p-5 shadow-sm">
                      <GithubContribution
                        githubKey={data.basic.githubKey}
                        username={data.basic.githubUseName}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoThreeTemplate;

