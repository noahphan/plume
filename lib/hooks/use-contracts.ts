"use client";

import { useState, useEffect, useCallback } from "react";
import type { Contract, ContractFilters } from "@/lib/types";
import { getContracts, getContract, getContractStats } from "@/lib/api/mock";

interface UseContractsResult {
  contracts: Contract[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContracts(filters?: ContractFilters): UseContractsResult {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getContracts(filters);
      setContracts(data);
    } catch (err) {
      setError("Failed to load contracts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return { contracts, isLoading, error, refetch: fetchContracts };
}

interface UseContractResult {
  contract: Contract | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContract(id: string): UseContractResult {
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContract = useCallback(async () => {
    if (!id) {
      setContract(null);
      setIsLoading(false);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getContract(id);
      setContract(data);
    } catch (err) {
      setError("Failed to load contract");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  return { contract, isLoading, error, refetch: fetchContract };
}

interface ContractStats {
  total: number;
  draft: number;
  pending: number;
  completed: number;
  voided: number;
}

interface UseContractStatsResult {
  stats: ContractStats | null;
  isLoading: boolean;
  error: string | null;
}

export function useContractStats(): UseContractStatsResult {
  const [stats, setStats] = useState<ContractStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getContractStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load stats");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return { stats, isLoading, error };
}
