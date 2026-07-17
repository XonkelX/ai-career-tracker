"use client";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <title>Something went wrong | CareerFlow</title>
      </head>
      <body
        style={{
          background: "#020617",
          color: "#f8fafc",
          fontFamily: "system-ui, sans-serif",
          margin: 0,
        }}
      >
        <main
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <section aria-labelledby="global-error-title">
            <p style={{ color: "#67e8f9", fontWeight: 600 }}>CareerFlow</p>
            <h1 id="global-error-title">Something went wrong</h1>
            <p>We could not load the application. Please try again.</p>
            <button
              onClick={() => unstable_retry()}
              style={{
                background: "#67e8f9",
                border: 0,
                borderRadius: "8px",
                color: "#020617",
                cursor: "pointer",
                fontWeight: 700,
                minHeight: "44px",
                padding: "10px 20px",
              }}
              type="button"
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
