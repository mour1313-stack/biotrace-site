"use client";

import ImmersiveFullscreenNav from "@/components/ui/immersive-full-screen-nav";

export default function ImmersiveFullscreenNavDemo() {
  return (
    <div className="w-full min-w-0">
      <ImmersiveFullscreenNav
        navConfig={{ brand: "Northline", brandHref: "#", overlayBg: "#101014", clipOrigin: "left" }}
        navContent={{
          agencyName: "Northline Studio",
          tagline: "Brand and product design for early-stage teams.",
          location: "Lisbon, Portugal",
          links: [
            { label: "Work", href: "#" },
            { label: "Studio", href: "#" },
            { label: "Journal", href: "#" },
            { label: "Contact", href: "#" },
          ],
          socials: [
            { type: "instagram", href: "#" },
            { type: "twitter", href: "#" },
            { type: "linkedin", href: "#" },
          ],
        }}
      />
      <main className="flex h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center text-black">
        <h1 className="max-w-2xl text-[7vw] leading-tight max-md:text-[9vw]">Immersive Full Screen Nav</h1>
      </main>
    </div>
  );
}
