import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-amber-50">
      <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-8">
        <h1 className="text-6xl md:text-6xl font-bold text-stone-900">
          Hey, we're <span className="font-bold">Alex and Finn</span>.
        </h1>

        <div className="text-xl md:text-2xl text-stone-900 flex items-center gap-2">
          <span>
            We've been building software together since 2014. From scrappy side
            projects to mobile apps for millions. We love making things!
          </span>
        </div>

        <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden shadow-xl my-8">
          <Image
            src="alexandfinn.png"
            alt="Alex and Finn working together on laptops surrounded by plants"
            fill
            priority
            className="object-cover"
          />
        </div>

        <Link
          href="mailto:alexandfinn@karugamo.agency"
          className="flex items-center gap-2 bg-olive text-white px-6 py-3 rounded-lg text-lg transition-colors duration-300 shadow-md"
        >
          <Mail size={20} />
          Get in Touch
        </Link>

        {/* Projects Section */}
        <div className="w-full mt-16">
          <h2 className="text-4xl font-bold text-stone-900 mb-8 text-left">
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="https://threejsjam.com"
              target="_blank"
              className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <Image
                src="/threejs.png"
                alt="Three.js Game Jam"
                fill
                className="object-cover"
              />
            </Link>

            <Link
              href="https://wundertest.ai"
              target="_blank"
              className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <Image
                src="/wundertest.png"
                alt="Wundertest.ai - AI-powered testing platform"
                fill
                className="object-cover"
              />
            </Link>
            <Link
              href="https://drive.alexandfinn.com"
              target="_blank"
              className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <Image
                src="/kartfight.png"
                alt="Kart Fight - A multiplayer kart racing game"
                fill
                className="object-cover"
              />
            </Link>
            <Link
              href="https://apps.apple.com/us/app/jots-ai-journal-diary/id6450964816"
              target="_blank"
              className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <Image
                src="/jots.png"
                alt="Jots - AI Voice Journal"
                fill
                className="object-cover"
              />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
