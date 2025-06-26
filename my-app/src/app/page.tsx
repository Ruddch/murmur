"use client";

import Image from "next/image";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
// import { ResourceCards } from "@/components/ui/ResourceCards";
import { ConnectionFlow } from "@/components/wallet/ConnectionFlow";

export default function Home() {

  return (
    <div className="relative grid grid-rows-[1fr_auto] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-avenue-mono)] bg-black overflow-hidden">
      <BackgroundEffects />

      <main className="relative flex flex-col items-center justify-center z-10 text-white text-center">
        <div className="flex flex-col items-center gap-8 max-w-6xl mx-auto">
          <Image
            src="/abstract.svg"
            alt="Abstract logo"
            width={240}
            height={32}
            quality={100}
            priority
          />
          
          <ConnectionFlow />
        </div>
      </main>

      {/* <ResourceCards /> */}
    </div>
  );
}
