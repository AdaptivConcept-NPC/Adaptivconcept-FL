# Walkthrough: Dynamic GitHub Tech Profile

I have successfully implemented the "GitHub Tech Profile" engine, transitioning your resume from static skill levels to a real-time, data-driven showcase of your actual repository inventory.

## Key Changes

### 1. The Automation Pipeline
- **Harvester Script**: [sync-github-stats.mjs](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/scripts/sync-github-stats.mjs)
  - Uses `octokit` to scan all public and private repositories.
  - Implements **Heuristic Detection**:
    - **React**: Scans `package.json` for dependencies.
    - **Laravel**: Scans `composer.json` for framework signatures.
    - **Azure/SQL**: Uses the Code Search API to detect cloud configurations and SQL dialects, even in private repos.
    - **Power BI**: Detects `.pbix` artifacts.
- **GitHub Action**: [update-tech-profile.yml](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/.github/workflows/update-tech-profile.yml)
  - Scheduled to run daily and on-push.
  - Automatically commits updated statistics back to the repo, triggering a Netlify redeploy.

### 2. UI/UX Enhancements
- **Stacked Tech Distribution**: Added a premium, segmented progress bar at the top of your expertise section. It visualizes the proportion of your work across different ecosystems.
- **Dynamic Counters**: Skill bars now show **Raw Repository Counts** instead of percentages.
- **Transparency**: Added a breakdown of **Source Repos vs. Forks** for every technology.
- **Snapshot Metadata**: Included a "Last Updated" label with a localized date string.

## Technical Details

| Feature | Implementation |
| :--- | :--- |
| **Data Store** | [github-stats.json](file:///c:/AppDev/My_Linkdin/projects/adaptivconcept-npc/Adaptivconcept-FL/adaptivconcept-react/src/data/github-stats.json) |
| **Icons** | Maintained existing premium shadow icon sets. |
| **Animation** | Utilized `framer-motion` for smooth fluid entries of the stacked segments. |

## Next Steps for You
1. **Trigger Manual Run**: Go to the **Actions** tab on GitHub, select "Update GitHub Tech Profile," and click **Run workflow** to see your real stats populate for the first time.
2. **Review Deployment**: Once the workflow commits the file, Netlify will pick up the changes and your Live Resume will reflect the new dynamic section.

> [!NOTE]
> Since the workflow runs on GitHub, the `GH_STATS_TOKEN` secret you added will handle the authentication for both private repo scanning and search rate limits.
