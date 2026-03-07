import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Trajectory from "@/components/sections/Trajectory";
import Contact from "@/components/sections/Contact";
import { fetchUserRepos, GITHUB_USERNAME } from "@/lib/github";
import type { GitHubRepo } from "@/types/github";

export default async function Home() {
  let repos: GitHubRepo[] = [];
  try {
    repos = await fetchUserRepos(GITHUB_USERNAME);
    console.log(`[Home] GitHub repos fetched: ${repos.length}`);
  } catch (err) {
    console.error("[Home] GitHub fetch failed:", err);
  }

  return (
    <main>
      <Hero />
      <Projects repos={repos} />
      <About />
      <Trajectory />
      <Contact />
    </main>
  );
}
