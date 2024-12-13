// monitor-issues.js

const axios = require("axios");

const owner = "dream-sports-labs";
const repo = "react-native-fast-image";
const githubToken = process.env.GITHUB_TOKEN; // Using GitHub Token

const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=open`;

async function fetchIssueData() {
  let totalOpenIssues = 0;
  let topFetchedIssues = [];
  let page = 1;

  try {
    while (true) {
      console.log(`Fetching data for page: ${page}`);

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `token ${githubToken}`,
        },
        params: {
          page: page,
          per_page: 100,
        },
      });

      const openIssues = response.data.filter((issue) => !issue.pull_request);

      totalOpenIssues += openIssues.length;

      const remainingSlots = 5 - topFetchedIssues.length;
      if (remainingSlots > 0) {
        topFetchedIssues.push(
          ...openIssues.slice(0, remainingSlots).map((issue) => ({
            title: issue.title,
            url: issue.html_url,
          }))
        );
      }

      const linkHeader = response.headers["link"];
      if (!linkHeader || !linkHeader.includes('rel="next"')) {
        break;
      }

      page++;
    }

    return { totalOpenIssues, topFetchedIssues };
  } catch (error) {
    console.error("Error fetching data from GitHub API:", error.message);
    return { totalOpenIssues: null, topFetchedIssues: [] };
  }
}

async function monitorIssueCount() {
  const { totalOpenIssues, topFetchedIssues } = await fetchIssueData();

  if (totalOpenIssues === null) return; // Skip if unable to fetch
  const emoji = "✅";
  const message = `${emoji} Open issues count is: ${totalOpenIssues}.`;

  const issueDetails = topFetchedIssues
    .map((issue, index) => `${index + 1}. <${issue.url}|${issue.title}>`)
    .join("\n");

  const slackMessage = `${message}\n\n*Top Issues:*\n${issueDetails}`;
  console.log(slackMessage);
}

// Run the monitor function
monitorIssueCount();
