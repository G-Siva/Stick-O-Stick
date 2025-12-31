import ImageBanner from "@/components/ImageBanner";
import Products from "@/components/Products";

async function getProducts() {
    try {
        // Relative URL — automatically uses localhost:3000 locally and your Vercel domain in production
        const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/api/products`, {
            // Optional: disable cache if you want fresh data on every request
            // cache: 'no-store',
            next: { revalidate: 60 }, // Revalidate every 60 seconds (recommended)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const products = await response.json();
        return products;
    } catch (err) {
        console.error('Error fetching products:', err);
        return []; // Return empty array so page doesn't crash
    }
}

export default async function Home() {
    const products = await getProducts();

    let planner = null;
    const stickers = [];

    for (let product of products) {
        if (product.name === 'Medieval Dragon Month Planner') {
            planner = product;
        } else {
            stickers.push(product);
        }
    }

    return (
        <>
            <ImageBanner />
            <section>
                <Products planner={planner} stickers={stickers} />
            </section>
        </>
    );
}