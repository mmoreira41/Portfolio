export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  pushed_at: string
  created_at: string
  updated_at: string
  topics: string[]
  visibility: string
  default_branch: string
}

/** Raw response from /repos/{owner}/{repo}/languages */
export type GitHubLanguages = Record<string, number>

/** One week from /repos/{owner}/{repo}/stats/commit_activity */
export interface CommitActivity {
  week: number   // Unix timestamp (start of week)
  total: number  // commits that week
  days: number[] // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
}

export interface LanguagePercentage {
  language: string
  bytes: number
  percentage: number
}

/** Aggregated data used by the project detail page */
export interface RepoDetails {
  repo: GitHubRepo
  languages: GitHubLanguages
  languagePercentages: LanguagePercentage[]
  commitActivity: CommitActivity[]
  readme: string | null
  totalCommits: number
  daysSinceLastPush: number
  /** "built in X days" — diff between first and last commit dates */
  builtInDays: number | null
}
