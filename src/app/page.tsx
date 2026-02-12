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
    // Use relative URL so it works on both localhost and Vercel
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/data`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    if (!res.ok) {
      console.error("Failed to fetch data:", res.status);
      return null;
    }
    return await res.json();
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
