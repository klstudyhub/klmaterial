import { useState, useEffect } from 'react';
import { materialsData, SUBJECTS } from '../data/materials';

interface Material {
  name: string;
  displayName: string;
  download_url: string;
  size: string;
  category: string | null;
}

export const useGitHubMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading for better UX (can be removed if instant is preferred)
    const loadMaterials = () => {
      try {
        setLoading(true);
        
        // Use local materials data
        const processedMaterials: Material[] = materialsData.map(material => ({
          ...material,
          category: material.category,
        }));

        // Simulate network delay for smoother transition
        setTimeout(() => {
          setMaterials(processedMaterials);
          setError(null);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load materials');
        console.error('Error loading materials:', err);
        setLoading(false);
      }
    };

    loadMaterials();
  }, []);

  return { materials, loading, error, subjects: SUBJECTS };
};
