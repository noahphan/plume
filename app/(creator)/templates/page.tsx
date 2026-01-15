"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTemplates } from "@/lib/hooks/use-templates";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateCard } from "@/components/features/template-card";
import { TEMPLATE_CATEGORIES, ANIMATIONS } from "@/lib/constants";
import type { Template } from "@/lib/types";

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const { templates, isLoading } = useTemplates(selectedCategory);

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      router.push(`/contracts/new?templateId=${selectedTemplate.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Templates"
        description="Choose a template to create a new contract"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Templates" },
        ]}
      />

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {TEMPLATE_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap",
              "transition-colors",
              selectedCategory === category.id
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-glass)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Template Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <GlassCard key={i} padding="md">
                  <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </GlassCard>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={ANIMATIONS.staggerContainer}
              initial="initial"
              animate="animate"
            >
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  variants={ANIMATIONS.staggerItem}
                  transition={{ delay: index * 0.05 }}
                >
                  <TemplateCard
                    template={template}
                    isSelected={selectedTemplate?.id === template.id}
                    onClick={() => setSelectedTemplate(template)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="lg:w-96 lg:sticky lg:top-24 lg:self-start">
          <GlassCard padding="lg">
            {selectedTemplate ? (
              <>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  {selectedTemplate.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                  {selectedTemplate.description}
                </p>

                {/* Variables */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">
                    Required Information
                  </h4>
                  <ul className="space-y-2">
                    {selectedTemplate.variables
                      .filter((v) => v.required)
                      .slice(0, 5)
                      .map((variable) => (
                        <li
                          key={variable.key}
                          className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                          {variable.label}
                        </li>
                      ))}
                    {selectedTemplate.variables.filter((v) => v.required).length > 5 && (
                      <li className="text-sm text-[var(--color-text-muted)]">
                        +{selectedTemplate.variables.filter((v) => v.required).length - 5} more
                      </li>
                    )}
                  </ul>
                </div>

                <Button onClick={handleUseTemplate} className="w-full">
                  Use Template
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-[var(--color-text-muted)]">
                  Select a template to preview
                </p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
