export function Footer() {
  return (
    <footer className="sticky bottom-0 border-t bg-white z-50">
      <div className="container mx-auto px-4 py-4 flex justify-center items-center gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Judgment Scorekeeper
        </p>
        <p className="text-sm text-muted-foreground">
          made by{" "}
          <a
            href="https://shriniket.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Shriniket
          </a>
        </p>
      </div>
    </footer>
  );
}
