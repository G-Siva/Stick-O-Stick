import ImageBanner from "@/components/ImageBanner";
import Products from "@/components/Products";

async function getProducts() {
    try {
        const response = await fetch('/api/products', {
            next: { revalidate: 60 },
        });

        if (!response.ok) return [];

        const products = await response.json();
        return products;
    } catch (err) {
        console.error('Product fetch error:', err);
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