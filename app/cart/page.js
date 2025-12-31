'use client';

import { useProducts } from "@/context/ProductContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const router = useRouter();
    const { cart, handleIncrementProduct } = useProducts();

    const total = Object.values(cart).reduce((acc, item) => {
        const cost = item.prices[0].unit_amount;
        const quantity = item.quantity;
        return acc + cost * quantity;
    }, 0);

    async function createCheckout() {
        try {
            const lineItems = Object.keys(cart).map((priceId) => ({
                price: priceId,
                quantity: cart[priceId].quantity,
            }));

            // Relative URL — works locally and on Vercel
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lineItems }),
            });

            const data = await response.json();

            if (response.ok && data.url) {
                router.push(data.url);
            } else {
                console.error('Checkout failed:', data);
                alert('Failed to create checkout session. Please try again.');
            }
        } catch (err) {
            console.error('Error creating checkout:', err);
            alert('An error occurred. Please try again.');
        }
    }

    return (
        <section className="cart-section">
            <h2>Your Cart</h2>
            {Object.keys(cart).length === 0 && <p>You have no items in your cart!</p>}

            <div className="cart-container">
                {Object.keys(cart).map((priceId) => {
                    const itemData = cart[priceId];
                    const itemQuantity = itemData.quantity;

                    const imgName =
                        itemData.name === 'Medieval Dragon Month Planner'
                            ? 'planner'
                            : itemData.name.replaceAll(' Sticker.png', '').replaceAll(' ', '_');
                    const imgUrl = 'low_res/' + imgName + '.jpeg';

                    return (
                        <div key={priceId} className="cart-item">
                            <img src={imgUrl} alt={itemData.name} />
                            <div className="cart-item-info">
                                <h3>{itemData.name}</h3>
                                <p>
                                    {itemData.description.slice(0, 100)}
                                    {itemData.description.length > 100 ? '...' : ''}
                                </p>
                                <h4>${(itemData.prices[0].unit_amount / 100).toFixed(2)}</h4>
                                <div className="quantity-container">
                                    <p><strong>Quantity</strong></p>
                                    <input
                                        type="number"
                                        min="1"
                                        value={itemQuantity}
                                        onChange={(e) => {
                                            const newValue = parseInt(e.target.value) || 1;
                                            handleIncrementProduct(itemData.default_price, newValue, itemData, true);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="checkout-container">
                <Link href="/">
                    <button>&larr; Continue shopping</button>
                </Link>
                <button onClick={createCheckout}>Checkout &rarr;</button>
            </div>

            {/* Optional: Show total */}
            {Object.keys(cart).length > 0 && (
                <div className="total">
                    <strong>Total: ${(total / 100).toFixed(2)}</strong>
                </div>
            )}
        </section>
    );
}