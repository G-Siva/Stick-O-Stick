import ImageBanner from "@/components/ImageBanner";
import Products from "@/components/Products";

async function getProducts() {
    try {
        let url = '/api/products'; // Default: relative URL (best for most cases)

        // Only use absolute URL if we're in a context where relative might not work
        // (rare in standard Vercel deploys, but safe fallback)
        if (process.env.VERCEL) {
            url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL}/api/products`;
        }

        const response = await fetch(url, {
            next: { revalidate: 60 }, // or cache: 'no-store' for fresh data
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const products = await response.json();
        return products;
    } catch (err) {
        console.error('Failed to fetch products:', err.message);
        return [];
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