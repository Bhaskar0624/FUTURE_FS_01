import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CursorWrapper from "@/components/CursorWrapper";
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; // Disable cache to see updates immediately

async function fetchData() {
  try {
    // Direct Supabase connection instead of HTTP fetch
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [profileRes, projectsRes, experiencesRes, skillsRes, certificatesRes, journeyRes] = await Promise.all([
      supabase.from('profile').select('*').limit(1).single(),
      supabase.from('projects').select('*').order('sort_order'),
      supabase.from('experiences').select('*').order('sort_order'),
      supabase.from('skills').select('*').order('sort_order'),
      supabase.from('certificates').select('*').order('sort_order'),
      supabase.from('journey').select('*').order('sort_order')
    ]);

    return {
      profile: profileRes.data || {},
      projects: projectsRes.data || [],
      experiences: experiencesRes.data || [],
      skills: skillsRes.data || [],
      certificates: certificatesRes.data || [],
      journey: journeyRes.data || []
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      profile: {},
      projects: [],
      experiences: [],
      skills: [],
      certificates: []
    };
  }
}

export default async function Home() {
  const data = await fetchData();
  const profile = data.profile || {};
  const projects = data.projects || [];
  const experiences = data.experiences || [];
  const skills = data.skills || [];
  const certificates = data.certificates || [];
  const journey = data.journey || [];

  return (
    <>
      <CursorWrapper />
      <Navbar />
      <main className="relative">
        <Hero profile={profile} />
        <div className="noise relative">
          <About profile={profile} journey={journey} />
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
