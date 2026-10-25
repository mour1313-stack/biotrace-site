import { AnimatedNavFramer } from "@/components/ui/navigation-menu";

export default function HomePage() {
  return (
    <>
      <AnimatedNavFramer />
      <main className="container mx-auto px-4">
        <div className="h-screen pt-24">
          <h1 className="text-4xl font-bold text-center">Navigation with Framer Motion</h1>
          <p className="text-center text-muted-foreground mt-4">
            Scroll down to see the magic. Click the circle to expand it back.
          </p>
        </div>
        <div className="h-[200vh] bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold">Page Content</h2>
        </div>
      </main>
    </>
  );
}
