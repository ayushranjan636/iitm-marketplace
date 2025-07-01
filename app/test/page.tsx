import BackendTest from '@/components/BackendTest';
import { useEffect, useState } from "react";
import { productAPI } from "@/lib/api";
import type { Product } from "@/lib/supabaseClient";

export default function TestPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getAll().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return <BackendTest />;
} 