"use client";

export default function GlobalError() {
  return (
    <html>
      <head>
        <title>Error</title>
      </head>
      <body>
        <div style={{ padding: "2rem", textAlign: "center", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Something went wrong!</h1>
          <p style={{ color: "#6b7280" }}>An error occurred</p>
        </div>
      </body>
    </html>
  );
}
