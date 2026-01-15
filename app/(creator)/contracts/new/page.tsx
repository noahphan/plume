"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight, ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTemplate } from "@/lib/hooks/use-templates";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentPreview } from "@/components/features/document-preview";
import { SkeletonForm, Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/patterns/toast";

function ContractBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId") || "";
  const { template, isLoading } = useTemplate(templateId);
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
    mode: "onChange",
  });

  const formValues = watch();

  // Calculate completion percentage
  const requiredFields = template?.variables.filter((v) => v.required) || [];
  const filledRequired = requiredFields.filter(
    (v) => formValues[v.key] && formValues[v.key].trim() !== ""
  ).length;
  const completionPercent =
    requiredFields.length > 0
      ? Math.round((filledRequired / requiredFields.length) * 100)
      : 0;

  const onSubmit = async (data: Record<string, string>) => {
    // In real app, this would create the contract
    console.log("Form data:", data);
    router.push(`/contracts/demo-contract-id/prepare`);
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        type: "success",
        title: "Draft saved",
        description: "Your contract draft has been saved.",
      });
    }, 500);
  };

  if (!templateId) {
    router.push("/templates");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Create Contract"
        description={template?.name || "Fill in the contract details"}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Templates", href: "/templates" },
          { label: "New Contract" },
        ]}
        actions={
          <Button variant="secondary" onClick={handleSaveDraft} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form Panel */}
        <div className="flex-1 lg:max-w-lg">
          <GlassCard padding="lg">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Completion
                </span>
                <span className="text-sm font-medium text-[var(--color-primary)]">
                  {completionPercent}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-surface-glass)] overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>

            {/* Form */}
            {isLoading ? (
              <SkeletonForm />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {template?.variables.map((variable) => (
                  <div key={variable.key}>
                    <Label htmlFor={variable.key} required={variable.required}>
                      {variable.label}
                    </Label>
                    <div className="mt-1.5">
                      {variable.type === "textarea" ? (
                        <Textarea
                          id={variable.key}
                          placeholder={variable.placeholder}
                          {...register(variable.key, {
                            required: variable.required ? "This field is required" : false,
                          })}
                          error={!!errors[variable.key]}
                          errorMessage={errors[variable.key]?.message as string}
                        />
                      ) : variable.type === "select" ? (
                        <Select
                          defaultValue={variable.defaultValue}
                          onValueChange={(value) => {
                            // Handle select change
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${variable.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {variable.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={variable.key}
                          type={variable.type === "email" ? "email" : variable.type === "date" ? "date" : "text"}
                          placeholder={variable.placeholder}
                          {...register(variable.key, {
                            required: variable.required ? "This field is required" : false,
                          })}
                          error={!!errors[variable.key]}
                          errorMessage={errors[variable.key]?.message as string}
                        />
                      )}
                    </div>
                  </div>
                ))}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)]">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" disabled={!isValid}>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            )}
          </GlassCard>
        </div>

        {/* Preview Panel */}
        <div className="flex-1">
          <GlassCard padding="none" className="h-[600px] lg:sticky lg:top-24">
            <DocumentPreview pages={4} templateId={template?.id} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Skeleton className="h-4 w-48 mb-3" />
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="flex gap-6">
        <GlassCard padding="lg" className="flex-1 lg:max-w-lg">
          <SkeletonForm />
        </GlassCard>
        <div className="flex-1 hidden lg:block">
          <Skeleton className="h-[600px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function ContractBuilderPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ContractBuilderContent />
    </Suspense>
  );
}
