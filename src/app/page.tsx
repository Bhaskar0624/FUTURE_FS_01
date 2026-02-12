import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CursorWrapper from "@/components/CursorWrapper";

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; // Disable cache to see updates immediately

async function fetchData() {
  try {
    // On Vercel, use VERCEL_URL. Locally, use localhost
    const protocol = process.env.VERCEL_URL ? 'https://' : 'http://';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const url = `${protocol}${host}/api/data`;

    console.log('Fetching from:', url); // Debug log

    const res = await fetch(url, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      console.error("Failed to fetch data:", res.status);
      return null;
    }

    const data = await res.json();
    console.log('Fetched data:', data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function Home() {
  const data = await fetchData();
  const profile = data?.profile || {};
  const projects = data?.projects || [];
  const experiences = data?.experiences || [];
  const skills = data?.skills || [];
  const certificates = data?.certificates || [];

  return (
    <>
      <CursorWrapper />
      <Navbar />
      <main className="relative">
        <Hero profile={profile} />
        <div className="noise relative">
          <About profile={profile} />
          <Skills skills={skills} />
          <Projects projects={projects} />
          <Experience experiences={experiences} />
          <Contact profile={profile} />
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
