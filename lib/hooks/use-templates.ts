"use client";

import { useState, useEffect, useCallback } from "react";
import type { Template } from "@/lib/types";
import { getTemplates, getTemplate } from "@/lib/api/mock";

interface UseTemplatesResult {
  templates: Template[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTemplates(category?: string): UseTemplatesResult {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTemplates(category);
      setTemplates(data);
    } catch (err) {
      setError("Failed to load templates");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { templates, isLoading, error, refetch: fetchTemplates };
}

interface UseTemplateResult {
  template: Template | null;
  isLoading: boolean;
  error: string | null;
}

export function useTemplate(id: string): UseTemplateResult {
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplate() {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTemplate(id);
        setTemplate(data);
      } catch (err) {
        setError("Failed to load template");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTemplate();
  }, [id]);

  return { template, isLoading, error };
}
