/**
 * lib/github.ts
 * Server-side only — never import from client components.
 * All fetches are cached with revalidate: 3600 (1 hour).
 * Token is read from GITHUB_TOKEN env var (optional, raises rate limit to 5000 req/h).
 */

import type {
  GitHubRepo,
  GitHubLanguages,
  CommitActivity,
  LanguagePercentage,
  RepoDetails,
} from "@/types/github"

const BASE_URL = "https://api.github.com"
export const GITHUB_USERNAME = "mmoreira41"
const REVALIDATE_SECONDS = 3600

// ─── Internal helpers ─────────────────────────────────────────────────────────

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }
  const token = process.env.GITHUB_TOKEN
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

async function githubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: buildHeaders(),
    next: { revalidate: REVALIDATE_SECONDS },
  })

  if (!res.ok) {
    throw new Error(
      `GitHub API ${res.status} ${res.statusText} — ${BASE_URL}${path}`
    )
  }

  return res.json() as Promise<T>
}

// ─── Primitive fetchers ───────────────────────────────────────────────────────

/** Fetch all public repos for a user, sorted by last push. */
export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  return githubFetch<GitHubRepo[]>(
    `/users/${username}/repos?sort=pushed&per_page=100`
  )
}

/** Fetch a single repo. */
export async function fetchRepo(
  username: string,
  repo: string
): Promise<GitHubRepo> {
  return githubFetch<GitHubRepo>(`/repos/${username}/${repo}`)
}

/** Fetch language breakdown (bytes per language). */
export async function fetchRepoLanguages(
  username: string,
  repo: string
): Promise<GitHubLanguages> {
  return githubFetch<GitHubLanguages>(`/repos/${username}/${repo}/languages`)
}

/**
 * Fetch weekly commit activity for the last 52 weeks.
 * GitHub may return HTTP 202 while computing stats — returns [] in that case.
 */
export async function fetchCommitActivity(
  username: string,
  repo: string
): Promise<CommitActivity[]> {
  const res = await fetch(
    `${BASE_URL}/repos/${username}/${repo}/stats/commit_activity`,
    { headers: buildHeaders(), next: { revalidate: REVALIDATE_SECONDS } }
  )

  if (res.status === 202 || !res.ok) return []

  const data: unknown = await res.json()
  return Array.isArray(data) ? (data as CommitActivity[]) : []
}

/**
 * Fetch decoded README content (markdown string) or null if not found.
 */
export async function fetchRepoReadme(
  username: string,
  repo: string
): Promise<string | null> {
  try {
    const data = await githubFetch<{ content: string; encoding: string }>(
      `/repos/${username}/${repo}/readme`
    )
    if (data.encoding === "base64") {
      return Buffer.from(data.content.replace(/\n/g, ""), "base64").toString(
        "utf-8"
      )
    }
    return data.content
  } catch {
    return null
  }
}

/**
 * Get total commit count by parsing the Link header from a single-item page.
 * This avoids fetching all commits.
 */
export async function fetchTotalCommits(
  username: string,
  repo: string
): Promise<number> {
  const res = await fetch(
    `${BASE_URL}/repos/${username}/${repo}/commits?per_page=1`,
    { headers: buildHeaders(), next: { revalidate: REVALIDATE_SECONDS } }
  )

  if (!res.ok) return 0

  const link = res.headers.get("Link")
  if (!link) {
    // Only one page — the array has at most 1 item
    const data: unknown = await res.json()
    return Array.isArray(data) ? data.length : 0
  }

  const match = link.match(/[&?]page=(\d+)>; rel="last"/)
  return match ? parseInt(match[1], 10) : 0
}

/**
 * Get the date of the very first commit (oldest) to calculate "built in X days".
 * Uses the last page trick same as fetchTotalCommits.
 */
async function fetchFirstCommitDate(
  username: string,
  repo: string,
  totalCommits: number
): Promise<string | null> {
  if (totalCommits === 0) return null

  try {
    const data = await githubFetch<Array<{ commit: { author: { date: string } } }>>(
      `/repos/${username}/${repo}/commits?per_page=1&page=${totalCommits}`
    )
    return data[0]?.commit?.author?.date ?? null
  } catch {
    return null
  }
}

// ─── Derived computations ─────────────────────────────────────────────────────

function computeLanguagePercentages(
  languages: GitHubLanguages
): LanguagePercentage[] {
  const total = Object.values(languages).reduce((sum, n) => sum + n, 0)
  if (total === 0) return []

  return Object.entries(languages)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: Math.round((bytes / total) * 1000) / 10, // 1 decimal
    }))
    .sort((a, b) => b.bytes - a.bytes)
}

function getDaysSince(isoDate: string): number {
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000)
}

// ─── Aggregated fetcher for project detail page ───────────────────────────────

/**
 * Fetch all data for a single project in parallel.
 * @param repoSlug — exact GitHub repo name (e.g. "custozero")
 */
export async function fetchRepoDetails(repoSlug: string): Promise<RepoDetails> {
  const username = GITHUB_USERNAME

  const [repo, languages, commitActivity, readme, totalCommits] =
    await Promise.all([
      fetchRepo(username, repoSlug),
      fetchRepoLanguages(username, repoSlug),
      fetchCommitActivity(username, repoSlug),
      fetchRepoReadme(username, repoSlug),
      fetchTotalCommits(username, repoSlug),
    ])

  const firstCommitDate = await fetchFirstCommitDate(
    username,
    repoSlug,
    totalCommits
  )

  const builtInDays =
    firstCommitDate !== null
      ? getDaysSince(firstCommitDate) - getDaysSince(repo.pushed_at)
      : null

  return {
    repo,
    languages,
    languagePercentages: computeLanguagePercentages(languages),
    commitActivity,
    readme,
    totalCommits,
    daysSinceLastPush: getDaysSince(repo.pushed_at),
    builtInDays,
  }
}
