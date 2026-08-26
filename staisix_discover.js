import { Octokit } from "@octokit/rest";
import axios from "axios";

// ==================================================================
// 📡 STAISIX DYNAMIC SYSTEM DISCOVERY CONFIGURATION
// ==================================================================
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const AIRTABLE_PAT = process.env.AIRTABLE_PAT || "";
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
        
        // 🌐 ABSOLUTE CANONICAL ROUTE: Using clean string concatenation for api.airtable.com
        const targetEndpointUrl = "https://api.airtable.com/v0/" + AIRTABLE_BASE_ID + "/" + TARGET_TABLE_ID;
        
        try {
          // 📡 Hardening network request layers via robust axios data tunneling
          await axios.post(
            targetEndpointUrl,
            {
              records: [{
                fields: {
                  "Repository Name": repoName,
                  "Activation_Status": "Discovered" // Ingested dynamically as unlinked row assets
                }
              }]
            },
            {
              headers: {
                "Authorization": "Bearer " + AIRTABLE_TOKEN,
                "Content-Type": "application/json"
              }
            }
          );
          console.log("✅ [PROVISIONED] Successfully synced " + repoName + " straight to Table 31.");
        } catch (apiErr) {
          console.log("❌ [SCHEMA REJECTION] Server denied row entry: " + apiErr.message);
        }
      }
    }
    console.log("\n🏁 [COMPLETE] AI discovery loop finished.\n");
  } catch (globalErr) {
    console.log("🛑 [FATAL CRASH] System onboarding engine failed: " + globalErr.message);
  }
}

executeDiscoveryScan();
