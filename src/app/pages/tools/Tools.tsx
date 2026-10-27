// /tools: the free tools, one line each
import { Link } from "react-router";
import { PageHead } from "../../components/PageHead";
import { tools, toolsPhoto } from "../../components/ToolPage";

export function Tools() {
  return (
    <div className="s-page s-tpage">
      <PageHead id="tools-title" label="Tools" aside="Free, and they run in your browser" title="Tools" lede="Small things I made for getting a release out the door." photo={toolsPhoto} />
      <section className="s-panel s-pad s-pbody s-toolsp" data-scene="olive" aria-label="Every tool">
        <ul className="s-tools-list">
          {tools.map((t, i) => (
            <li key={t.path}>
              <Link to={t.path}>
                <span className="s-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="s-tools-name">{t.name}</span>
                <span className="s-muted">{t.text}</span>
                <span aria-hidden="true" className="s-tools-go">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
