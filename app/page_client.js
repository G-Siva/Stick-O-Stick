'use client'
import ImageBanner from "@/components/ImageBanner";
import Products from "@/components/Products";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [planner, setPlanner] = useState(null);
  const [stickers, setStickers] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Just use relative URL — works both locally and on Vercel
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const productsData = await response.json();
        setProducts(productsData);

        // Separate planner and stickers
        let foundPlanner = null;
        const foundStickers = [];

        for (let product of productsData) {
          if (product.name === 'Medieval Dragon Month Planner') {
            foundPlanner = product;
          } else {
            foundStickers.push(product);
          }
        }

        setPlanner(foundPlanner);
        setStickers(foundStickers);

      } catch (err) {
        console.error('Failed to fetch products:', err.message);
        // Optional: show error UI to user
      }
    }

    fetchProducts();
  }, []);

  return (
    <>
      <ImageBanner />
      <section>
        <Products planner={planner} stickers={stickers} />
      </section>
    </>
  );
}