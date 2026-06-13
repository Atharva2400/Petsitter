import { PawPrint, Heart } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-muted/30 py-10">
    <div className="container mx-auto px-4 text-center space-y-4">
      <div className="flex items-center justify-center gap-2 text-lg font-bold">
        <PawPrint className="h-5 w-5 text-primary" />
        Pet Sitter Instructions
      </div>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        A simple tool to keep your pet safe and happy while you're away. Made with <Heart className="inline h-3 w-3 text-destructive" /> for pets everywhere.
      </p>
      <p className="text-xs text-muted-foreground">© 2026 Pet Sitter Instructions — College Project Demo</p>
    </div>
  </footer>
);

export default Footer;
