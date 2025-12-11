import Link from "next/link";

export default function NotFound() {
  return (
    <html>
      <head>
        <title>404 - Página não encontrada</title>
      </head>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "1rem",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>404</h1>
          <p style={{ color: "#6b7280" }}>Página não encontrada</p>
          <Link
            href="/"
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1.5rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: "0.5rem",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Voltar para Home
          </Link>
        </div>
      </body>
    </html>
  );
}
