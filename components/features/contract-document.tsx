"use client";

import type { TemplateCategory } from "@/lib/types";
import { SOWDocument } from "@/components/features/sow-document";
import { TOSDocument } from "@/components/features/tos-document";

type ContractDocumentComponent = (props: { className?: string }) => JSX.Element;

const DOCUMENT_BY_TEMPLATE_ID: Record<string, ContractDocumentComponent> = {
  "tpl-sow-001": SOWDocument,
  "tpl-tos-001": TOSDocument,
};

const DOCUMENT_BY_CATEGORY: Record<Exclude<TemplateCategory, "all">, ContractDocumentComponent> = {
  sow: SOWDocument,
  tos: TOSDocument,
};

interface ContractDocumentProps {
  templateId?: string | null;
  templateCategory?: TemplateCategory | null;
  className?: string;
}

export function ContractDocument({ templateId, templateCategory, className }: ContractDocumentProps) {
  const DocumentComponent =
    (templateId && DOCUMENT_BY_TEMPLATE_ID[templateId]) ||
    (templateCategory && templateCategory !== "all" && DOCUMENT_BY_CATEGORY[templateCategory]) ||
    SOWDocument;

  return <DocumentComponent className={className} />;
}
