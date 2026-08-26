import { Octokit } from "@octokit/rest";

// ==================================================================
// 📡 STAISIX DYNAMIC SYSTEM DISCOVERY CONFIGURATION
// ==================================================================
const GITHUB_TOKEN = "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";
const AIRTABLE_TOKEN = "patjaULRSPnjizPl3.31760b582bf09d428f67c6df00c3a86b080e3bedea3a9a7f63734165f90ac8b7";
const AIRTABLE_BASE_ID = "appq8GkI2I3WoCUpz";
const TARGET_TABLE_ID = "tblEETbG01lZH4bby"; // Table 31: AI Systems ID

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function executeDiscoveryScan() {
  console.log("🔍 [STAISIX] Initializing dynamic repository discovery loop...");
  try {
    // 1. Fetch repositories from the authenticated profile via GitHub REST API
    const { data: repositories } = await octokit.repos.listForAuthenticatedUser({
      visibility: "all",
      affiliation: "owner",
      per_page: 100
    });

    console.log("📡 Connected to GitHub. Retrieved " + repositories.length + " repositories.");

    for (const repo of repositories) {
      const repoName = repo.name;
      
      // 2. Dynamic Discovery Phase: Scan and isolate any repositories matching your active code projects
      if (["credit_line_underwriter", "customer_churn_predictor", "patient_triage_classifier"].includes(repoName)) {
        console.log("🤖 [AI ASSET DETECTED] Found repository footprint for: " + repoName);
        
        // 🌐 ABSOLUTE CANONICAL ROUTE: Clean API domain string with explicit backslash formatting
        const targetEndpointUrl = "https://airtable.com" + AIRTABLE_BASE_ID + "/" + TARGET_TABLE_ID;
        
        try {
          const response = await fetch(targetEndpointUrl, {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + AIRTABLE_TOKEN,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              records: [{
                fields: {
                  "Repository Name": repoName,
                  "Activation_Status": "Discovered" // Ingested dynamically as unlinked row assets
                }
              }]
            })
          });

          if (response.ok) {
            console.log("✅ [PROVISIONED] Successfully synced " + repoName + " straight to Table 31.");
          } else {
            const errorPayload = await response.json();
            console.log("❌ [SCHEMA REJECTION] Server denied row entry: " + JSON.stringify(errorPayload));
          }
        } catch (networkErr) {
          console.log("❌ [NETWORK BLOCKED] Link failed for " + repoName + ": " + networkErr.message);
        }
      }
    }
    console.log("\n🏁 [COMPLETE] AI discovery loop finished.\n");
  } catch (globalErr) {
    console.log("🛑 [FATAL CRASH] System onboarding engine failed: " + globalErr.message);
  }
}

executeDiscoveryScan();
