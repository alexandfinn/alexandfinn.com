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

        <div className="flex gap-4">
          <Link
            href="mailto:alexandfinn@karugamo.agency"
            className="flex items-center gap-2 bg-olive text-white px-6 py-3 rounded-lg text-lg transition-colors duration-300 shadow-md"
          >
            <Mail size={20} />
            Get in Touch
          </Link>
          <Link
            href="https://twitter.com/alex_and_finn"
            target="_blank"
            className="flex items-center gap-2 bg-olive  text-white px-6 py-3 rounded-lg text-lg transition-colors duration-300 shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            @alex_and_finn
          </Link>
        </div>

        {/* Projects Section */}
        <div className="w-full mt-16">
          <h2 className="text-4xl font-bold text-stone-900 mb-8 text-left">
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="https://sip.alexandfinn.com"
              target="_blank"
              className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <Image
                src="/sip.png"
                alt="Sip - Your Water Buddy"
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
            <Link
              href="https://tagesspiegel.de"
              target="_blank"
              className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <Image
                src="/tagesspiegel.png"
                alt="Tagesspiegel - German Newspaper"
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
