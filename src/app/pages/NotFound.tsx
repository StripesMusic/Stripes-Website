// 404: the S, cut apart once as the page opens, the way it glitches on a kick in the hero.
import { Link } from "react-router";
import { StripesMark } from "../components/StripesMark";

export function NotFound() {
  return (
    <div className="s-page s-404">
      <section className="s-panel s-pad s-phead s-404-in" data-scene="hero" aria-labelledby="nf-title">
        <div className="s-404-mark" aria-hidden="true">
          <StripesMark className="s-404-s" />
          <StripesMark className="s-404-s s-404-cut s-404-cut-a" />
          <StripesMark className="s-404-s s-404-cut s-404-cut-b" />
        </div>
        <div className="s-sec-head">
          <span className="s-mono">Error 404</span>
          <span className="s-mono">Signal lost · −∞ dB</span>
        </div>
        <div className="s-404-text">
          <h1 className="s-ptitle" id="nf-title">
            This page is out of control.
          </h1>
          <div className="s-pintro">
            <p className="s-big">It doesn't exist, or it moved.</p>
            <div className="s-ctas">
              <Link className="s-btn s-btn-solid" to="/">
                Home
              </Link>
              <Link className="s-btn" to="/music">
                Music
              </Link>
              <Link className="s-btn" to="/designs">
                Designs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
