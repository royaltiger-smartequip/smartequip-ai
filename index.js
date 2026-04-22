const MODAL_API_URL = "https://royaltiger-smartequip--digital-factory-api-trigger.modal.run";
const MODAL_APP_ID = "ap-9bZ0fIxrb5Dq3aaBpM8r4v";
const MODAL_FUNCTION_ID = "fu-ZODV8O1l2UlprFQfm3NVE8";
const DEFAULT_MODEL = "claude-sonnet-4-5";

/**
 * SmartEquip AI - GitHub App
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  app.log.info("SmartEquip AI has started!");

  app.on("issue_comment.created", async (context) => {
    if (context.payload.comment.user.type === "Bot") {
      return;
    }

    const commentBody = context.payload.comment.body;
    const isMentioned = commentBody.includes("@smartequip-ai[bot]") ||
      commentBody.includes("@smartequip-ai");
    if (!isMentioned) {
      return;
    }

    const owner = context.payload.repository.owner.login;
    const repoName = context.payload.repository.name;
    const repoFullName = context.payload.repository.full_name;
    const commentAuthor = context.payload.comment.user.login;
    const isPullRequest = context.payload.issue.pull_request !== undefined;
    const issueNumber = context.payload.issue.number;

    let branchName = null;
    if (isPullRequest) {
      const pr = await context.octokit.pulls.get({
        owner,
        repo: repoName,
        pull_number: issueNumber,
      });
      branchName = pr.data.head.ref;
    }

    // React with rocket emoji
    try {
      await context.octokit.reactions.createForIssueComment({
        owner,
        repo: repoName,
        comment_id: context.payload.comment.id,
        content: "rocket",
      });
    } catch (err) {
      app.log.warn("Failed to add rocket reaction: " + err.message);
    }

    // Build the prompt
    const cleanedComment = commentBody
      .replace(/@smartequip-ai\[bot\]/g, "")
      .replace(/@smartequip-ai/g, "")
      .trim();

    const contextLines = [
      `Repository: ${repoFullName}`,
      `Org: ${owner}`,
      `Type: ${isPullRequest ? "Pull Request" : "Issue"}`,
      `Number: #${issueNumber}`,
    ];
    if (branchName) {
      contextLines.push(`Branch: ${branchName}`);
    }
    contextLines.push(`Requested by: ${commentAuthor}`);

    const issueOrPR = isPullRequest ? "PR" : "issue";
    const prompt = `clone smartequip-agent-skills and smartequip-products. Also clone ${repoName}. IMPORTANT: Before starting work, read the MODAL_MONITOR_URL environment variable. If it is set, post a comment on ${issueOrPR} #${issueNumber} in ${repoFullName} using gh, like this: gh issue comment ${issueNumber} --repo ${repoFullName} --body "Working on this.\n\n| Detail | Value |\n|--------|-------|\n| **Monitor** | [View in Modal]($MODAL_MONITOR_URL) |"\n\nHere is the user's comment: ${cleanedComment}. If you need further context, refer to the previous comments to figure out what to do.\n\n--- Context ---\n${contextLines.join("\n")}`;

    app.log.info(`Triggering Modal for ${repoFullName}#${issueNumber}`);

    try {
      // Trigger Modal
      const response = await fetch(MODAL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: DEFAULT_MODEL, prompt }),
      });

      if (!response.ok) {
        throw new Error(`Modal API returned ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      if (!data.call_id) {
        throw new Error(`Modal API did not return call_id: ${JSON.stringify(data)}`);
      }

      // Build monitoring URL
      const now = Math.floor(Date.now() / 1000);
      const start = now - 86400;
      const monitorUrl = `https://modal.com/apps/royaltiger-smartequip/main/${MODAL_APP_ID}?start=${start}.000&end=${now}.000&live=true&fcId=${data.call_id}&activeTab=functions&functionId=${MODAL_FUNCTION_ID}&functionSection=calls&limit=100&includeLogContext=false&useInputsTable=true`;

      // Post confirmation comment
      const confirmationBody = `## SmartEquip AI - Triggered

| Detail | Value |
|--------|-------|
| **Modal Call ID** | \`${data.call_id}\` |
| **Monitor** | [View in Modal](${monitorUrl}) |
${branchName ? `| **Branch** | \`${branchName}\` |\n` : ""}| **Type** | ${isPullRequest ? "Pull Request" : "Issue"} |
| **Triggered by** | @${commentAuthor} |`;

      await context.octokit.issues.createComment(context.issue({ body: confirmationBody }));

    } catch (err) {
      app.log.error("Modal trigger failed: " + err.message);

      const errorBody = `## SmartEquip AI - Error

Failed to trigger Modal instance.

**Error:** \`${err.message}\`

Please check the app logs or try again.`;

      await context.octokit.issues.createComment(context.issue({ body: errorBody }));
    }
  });
};
