import React from "react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="mb-6 text-muted-foreground">The page you are looking for does not exist.</p>
      <Link href="/" className="text-primary hover:underline">
        Return to Periodic Table
      </Link>
    </div>
  );
}
