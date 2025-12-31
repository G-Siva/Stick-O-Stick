import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

export async function GET() {
    // Add this for debugging on Vercel
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error("STRIPE_SECRET_KEY is missing!");
        return Response.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
        const products = await stripe.products.list({ active: true });
        const prices = await stripe.prices.list({ active: true });

        const combinedData = products.data.map((product) => {
            const productPrices = prices.data.filter((price) => price.product === product.id);

            return {
                ...product,
                prices: productPrices.map((price) => ({
                    id: price.id,
                    unit_amount: price.unit_amount,
                    currency: price.currency,
                    recurring: price.recurring,
                })),
            };
        });

        return Response.json(combinedData);
    } catch (err) {
        console.error('Error fetching data from Stripe:', err.message);
        return Response.json({ error: 'Failed to fetch data from Stripe' }, { status: 500 });
    }
}