import { useState } from "react";
import { ToolPage } from "../../components/ToolPage";

const demoGif = "https://assets.musicbystripes.com/GDAutoExportExample.gif";

export function GDAutoExport() {
  const [driveLink, setDriveLink] = useState("");
  const [finalLink, setFinalLink] = useState("");
  const [status, setStatus] = useState<{ text: string; good: boolean } | null>(null);

  const convert = () => {
    const input = driveLink.trim();
    const id = input.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ?? input.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1];
    if (!id) {
      setFinalLink("");
      setStatus({ text: "That isn't a Google Drive file link", good: false });
      return;
    }
    setFinalLink(`https://drive.google.com/uc?export=download&id=${id}`);
    setStatus(null);
  };

  const copyLink = () => navigator.clipboard.writeText(finalLink).then(() => setStatus({ text: "Copied", good: true }));

  const clearAll = () => {
    setDriveLink("");
    setFinalLink("");
    setStatus(null);
  };

  return (
    <ToolPage
      path="/tools/gd-auto-export"
      title="GD Auto Export"
      lede="Turn a Google Drive file link into a link that downloads instantly."
      note="Works locally. Not affiliated with Google."
      how={
        <ol>
          <li>Share the file in Google Drive with "Anyone with the link".</li>
          <li>Copy its sharing link and paste it above.</li>
          <li>Press Generate, then copy the direct download link.</li>
          <li>Use it anywhere: opening it downloads the file at once.</li>
        </ol>
      }
      why={
        <>
          <p>
            Drive normally shows a preview page with its own download button first. A direct link skips that page, so fewer people click away before the file
            downloads, and nobody wonders which button to press. Handy for extended mixes and sample packs.
          </p>
          <img src={demoGif} alt="A direct link downloading a file straight away" className="s-tool-demo" loading="lazy" />
        </>
      }
    >
      <form
        className="s-form"
        onSubmit={(e) => {
          e.preventDefault();
          convert();
        }}
      >
        <label className="s-field">
          <span className="s-mono">Google Drive file link</span>
          <input
            className="s-input"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            placeholder="https://drive.google.com/file/d/FILE_ID/view"
            aria-describedby="gd-hint"
          />
          <span className="s-hint" id="gd-hint">
            Both /file/d/ and ?id= links work
          </span>
        </label>
        <button type="submit" className="s-btn s-btn-solid s-btn-lg">
          Generate link
        </button>
      </form>

      {finalLink && (
        <div className="s-out">
          <span className="s-mono">Direct download link</span>
          <code className="s-out-val">{finalLink}</code>
          <div className="s-ctas">
            <button type="button" className="s-btn" onClick={copyLink}>
              Copy
            </button>
            <button type="button" className="s-btn" onClick={clearAll}>
              Clear
            </button>
          </div>
        </div>
      )}
      {status && (
        <p className={"s-status s-mono" + (status.good ? " is-good" : " is-bad")} role="status">
          {status.text}
        </p>
      )}
    </ToolPage>
  );
}
