// Draft: the store, hidden. It only exists on preview addresses (routes.tsx), isn't in the menu,
// and tells search engines to stay away. Checkout goes through a provider that handles payment,
// tax and file delivery, so the site never sees card details.
import { useEffect } from "react";
import { PageHead } from "../components/PageHead";
import { ImageSlot } from "../components/ImageSlot";
import { products } from "../data/store";

export function Store() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="s-page s-store">
      <PageHead id="store-title" label="Store" aside="Draft · not public" title="Store" lede="Stems, packs and templates. Instant download after checkout." />
      <section className="s-panel s-pad s-pbody" data-scene="olive" aria-label="Products">
        <ul className="s-store-grid">
          {products.map((p) => (
            <li key={p.title} className="s-store-item">
              <ImageSlot src={p.image} alt="" ratio="1 / 1" label={p.type} />
              <div className="s-store-info">
                <p className="s-mono">{p.type}</p>
                <h2 className="s-store-name">{p.title}</h2>
                <p className="s-muted">{p.details}</p>
                <ul className="s-store-inc">
                  {p.includes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <div className="s-store-buy">
                  <span className="s-store-price">{p.price}</span>
                  {p.checkout ? (
                    <a className="s-btn s-btn-solid" href={p.checkout} target="_blank" rel="noopener noreferrer">
                      Buy ↗
                    </a>
                  ) : (
                    <button type="button" className="s-btn" disabled>
                      Coming soon
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="s-mono s-store-note">Draft: the products and prices are placeholders, and checkout isn't connected yet.</p>
      </section>
    </div>
  );
}
