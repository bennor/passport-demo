import { getIdentity, type PassportIdentity } from "@vercel/passport";
import { connection } from "next/server";
import { logOut } from "./actions";

function valueOrDash(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  return String(value);
}

function IdentityCard({ identity }: { identity: PassportIdentity }) {
  const details = [
    ["Name", identity.name],
    ["Email", identity.email],
    ["Subject", identity.subject],
    ["External subject", identity.externalSubject],
    ["External issuer", identity.externalIssuer],
    ["Owner", identity.owner.slug],
    ["Owner ID", identity.owner.id],
    ["Project", identity.project?.name],
    ["Project ID", identity.project?.id],
    ["Environment", identity.environment],
    ["Connector ID", identity.connectorId],
    ["Token source", identity.tokenSource],
  ];

  return (
    <>
      <section className="identity-card" aria-labelledby="identity-heading">
        <div className="card-heading">
          <div>
            <p className="eyebrow">Authenticated identity</p>
            <h2 id="identity-heading">{identity.name ?? identity.email ?? identity.subject}</h2>
          </div>
          <span className={identity.verified ? "status verified" : "status"}>
            <span className="status-dot" aria-hidden="true" />
            {identity.verified ? "Verified" : "Unverified"}
          </span>
        </div>

        <dl className="details-grid">
          {details.map(([label, value]) => (
            <div className="detail" key={label}>
              <dt>{label}</dt>
              <dd>{valueOrDash(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="payload-card" aria-labelledby="payload-heading">
        <div className="payload-heading">
          <div>
            <p className="eyebrow">Passport payload</p>
            <h2 id="payload-heading">All claims</h2>
          </div>
          <span className="claim-count">
            {Object.keys(identity.payload).length} claims
          </span>
        </div>
        <pre>
          <code>{JSON.stringify(identity.payload, null, 2)}</code>
        </pre>
      </section>

      <p className="security-note">
        The Passport token is intentionally omitted from this page.
      </p>
    </>
  );
}

function UnauthorizedCard() {
  return (
    <section className="empty-card" aria-labelledby="unauthorized-heading">
      <span className="empty-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 10V8a5 5 0 0 1 10 0v2" />
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M12 14v2" />
        </svg>
      </span>
      <p className="eyebrow">No identity found</p>
      <h2 id="unauthorized-heading">Passport is waiting</h2>
      <p>
        Open this deployment through a configured Vercel Passport connection to
        see the identity attached to your request.
      </p>
    </section>
  );
}

export default async function Home() {
  await connection();

  let identity: PassportIdentity | null = null;

  try {
    identity = await getIdentity();
  } catch {
    // Invalid or missing credentials are represented by the empty state.
  }

  return (
    <main>
      <div className="page-shell">
        <header className="site-header">
          <a className="brand" href="https://vercel.com" aria-label="Vercel">
            <svg viewBox="0 0 24 21" fill="currentColor" aria-hidden="true">
              <path d="M12 0 24 21H0L12 0Z" />
            </svg>
            <span>Passport Demo</span>
          </a>
          <div className="header-actions">
            <span className="runtime-badge">Server rendered</span>
            {identity ? (
              <form action={logOut}>
                <button className="logout-button" type="submit">
                  Log out
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 3H3.5A1.5 1.5 0 0 0 2 4.5v7A1.5 1.5 0 0 0 3.5 13H6M10.5 5.5 13 8l-2.5 2.5M13 8H6" />
                  </svg>
                </button>
              </form>
            ) : null}
          </div>
        </header>

        <div className="intro">
          <p className="eyebrow">Vercel Passport</p>
          <h1>Your request, identified.</h1>
          <p className="lede">
            A live view of the identity Vercel Passport made available to this
            server-rendered request.
          </p>
        </div>

        {identity ? <IdentityCard identity={identity} /> : <UnauthorizedCard />}

        <footer>
          Rendered securely on the server with Next.js and Vercel Passport.
        </footer>
      </div>
    </main>
  );
}
