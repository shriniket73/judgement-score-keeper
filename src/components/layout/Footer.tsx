// components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="sticky bottom-0 border-t bg-white z-50">
      <div className="container mx-auto px-4 py-4">
        <p className="text-sm text-center text-muted-foreground">
          © {new Date().getFullYear()} Judgment Scorekeeper
        </p>
      </div>
    </footer>
  );
}