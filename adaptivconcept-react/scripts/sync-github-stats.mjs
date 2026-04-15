import { Octokit } from "octokit";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(__dirname, "../src/data/github-stats.json");

// Define high-level skills we want to track
const SKILL_CONFIG = [
  { 
    name: "React (Front-end)", 
    id: "react",
    color: "#61DAFB", 
    heuristics: { 
      filename: "package.json", 
      content: "react" 
    } 
  },
  { 
    name: "Vanilla PHP", 
    id: "php",
    color: "#777BB4", 
    heuristics: { 
      language: "PHP" 
    } 
  },
  { 
    name: "Python Automation", 
    id: "python",
    color: "#3776AB", 
    heuristics: { 
      language: "Python" 
    } 
  },
  { 
    name: "Power BI Analytics", 
    id: "power-bi",
    color: "#F2C811", 
    heuristics: { 
      extension: ".pbix" 
    } 
  },
  { 
    name: "MySQL / SQL Server", 
    id: "sql",
    color: "#4479A1", 
    heuristics: { 
      query: "mysql sql-server database.sql" 
    } 
  },
  { 
    name: "Laravel Framework", 
    id: "laravel",
    color: "#FF2D20", 
    heuristics: { 
      filename: "composer.json", 
      content: "laravel/framework" 
    } 
  },
  { 
    name: "Microsoft Azure", 
    id: "azure",
    color: "#0078D4", 
    heuristics: { 
      query: "azure-pipelines terraform cloud-config",
      extension: ".tf"
    } 
  }
];

async function syncGithubStats() {
  const GITHUB_TOKEN = process.env.GH_STATS_TOKEN;
  if (!GITHUB_TOKEN) {
    console.error("Missing GH_STATS_TOKEN environment variable.");
    process.exit(1);
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  const username = "iarxii";

  try {
    console.log(`Fetching data for user: ${username}...`);
    
    // 1. Fetch all repositories
    const repos = await octokit.paginate(octokit.rest.repos.listForUser, {
      username,
      per_page: 100,
      type: "all",
    });

    const stats = {
      lastUpdated: new Date().toISOString(),
      overview: {
        total: repos.length,
        source: repos.filter(r => !r.fork).length,
        forks: repos.filter(r => r.fork).length,
      },
      skills: {}
    };

    // Initialize skill stats
    SKILL_CONFIG.forEach(s => {
      stats.skills[s.id] = {
        name: s.name,
        color: s.color,
        repoCount: 0,
        forkCount: 0,
        repos: []
      };
    });

    console.log(`Analyzing ${repos.length} repositories...`);

    // 2. Aggregate counts and identify tech patterns
    for (const repo of repos) {
      for (const skill of SKILL_CONFIG) {
        let isMatch = false;

        // Language heuristic
        if (skill.heuristics.language && repo.language === skill.heuristics.language) {
          isMatch = true;
        }

        // Extension heuristic
        if (skill.heuristics.extension) {
          // This requires checking file list which might be expensive
          // For now we check the primary language as a proxy or assume specialized repos
          // A better way is using the search API later, but let's keep it robust for now
          if (repo.name.toLowerCase().includes(skill.id)) isMatch = true;
        }

        if (isMatch) {
          stats.skills[skill.id].repoCount++;
          if (repo.fork) stats.skills[skill.id].forkCount++;
          stats.skills[skill.id].repos.push(repo.name);
        }
      }
    }

    // 3. Refining with Search API for Specific Frameworks
    // To identify React/Laravel/Azure specifically across all repos (even private)
    console.log("Refining framework detection via Search API...");
    for (const skill of SKILL_CONFIG) {
        if (skill.heuristics.filename || skill.heuristics.query) {
            let searchQuery = `user:${username}`;
            if (skill.heuristics.filename) searchQuery += ` filename:${skill.heuristics.filename}`;
            if (skill.heuristics.content) searchQuery += ` ${skill.heuristics.content}`;
            if (skill.heuristics.query) searchQuery += ` ${skill.heuristics.query}`;
            if (skill.heuristics.extension) searchQuery += ` extension:${skill.heuristics.extension.replace('.','')}`;

            try {
                const searchRes = await octokit.rest.search.code({ q: searchQuery });
                
                // Get unique repo names from search results
                const matchingRepos = [...new Set(searchRes.data.items.map(item => item.repository.full_name))];
                
                matchingRepos.forEach(repoFullName => {
                    const repoName = repoFullName.split('/')[1];
                    const originalRepo = repos.find(r => r.name === repoName);
                    
                    if (originalRepo && !stats.skills[skill.id].repos.includes(repoName)) {
                        stats.skills[skill.id].repoCount++;
                        if (originalRepo.fork) stats.skills[skill.id].forkCount++;
                        stats.skills[skill.id].repos.push(repoName);
                    }
                });
                
                // Sleep briefly to avoid search rate limits
                await new Promise(r => setTimeout(r, 2000));
            } catch (searchErr) {
                console.warn(`Search failed for ${skill.name}:`, searchErr.message);
            }
        }
    }

    // 4. Write to file
    await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(stats, null, 2));
    
    console.log(`Success! Stats written to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("Critical error during sync:", err);
    process.exit(1);
  }
}

syncGithubStats();
