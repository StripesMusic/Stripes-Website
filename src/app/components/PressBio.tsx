// The press bio as paragraphs, with the artists it names linked to their Spotify.
import { bioLinks, pressBio } from "../data/bio";

const names = new RegExp(`(${Object.keys(bioLinks).join("|")})`, "g");

export function PressBio({ className }: { className?: string }) {
  return (
    <div className={className}>
      {pressBio.map((p) => (
        <p key={p.slice(0, 20)}>
          {p.split(names).map((part, i) =>
            bioLinks[part] ? (
              <a key={i} href={bioLinks[part]} target="_blank" rel="noopener noreferrer">
                {part}
              </a>
            ) : (
              part
            ),
          )}
        </p>
      ))}
    </div>
  );
}
