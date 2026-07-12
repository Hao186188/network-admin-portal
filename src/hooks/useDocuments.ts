// src/hooks/useDocuments.ts
import { Document } from "@/app/(routes)/documents/types";
import { supabase } from "@/lib/db/supabase-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useDocuments() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Query: Fetch documents
  const documentsQuery = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Document[];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Query: Fetch single document
  const useDocument = (id: string) => {
    return useQuery({
      queryKey: ["document", id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        return data as Document;
      },
      enabled: !!id,
      staleTime: 30 * 1000,
    });
  };

  // Mutation: Increment view
  const incrementViewMutation = useMutation({
    mutationFn: async (id: string) => {
      // Get current views
      const { data: current } = await supabase
        .from("documents")
        .select("views")
        .eq("id", id)
        .single();

      const newViews = (current?.views || 0) + 1;

      const { error } = await supabase
        .from("documents")
        .update({ views: newViews })
        .eq("id", id);

      if (error) throw error;
      return newViews;
    },
    onSuccess: (newViews, id) => {
      // Update cache
      queryClient.setQueryData(["document", id], (old: any) => ({
        ...old,
        views: newViews,
      }));
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  // Mutation: Update rating
  const updateRatingMutation = useMutation({
    mutationFn: async ({ id, rating }: { id: string; rating: number }) => {
      const { data, error } = await supabase
        .from("documents")
        .update({ rating_avg: rating })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["document", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  return {
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    error: documentsQuery.error,
    refresh: documentsQuery.refetch,
    useDocument,
    incrementView: incrementViewMutation.mutate,
    updateRating: updateRatingMutation.mutate,
    isUpdating:
      incrementViewMutation.isPending || updateRatingMutation.isPending,
  };
}
