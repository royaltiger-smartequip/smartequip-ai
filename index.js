/**
 * SmartEquip AI - GitHub App
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  app.log.info("SmartEquip AI has started!");

  // Listen to all issues events (opened, edited, closed, etc.)
  app.on("issues.opened", async (context) => {
    app.log.info("Issue opened event received");

    const issueComment = context.issue({
      body: "Hello World! 👋 SmartEquip AI is now watching this issue.",
    });

    return context.octokit.issues.createComment(issueComment);
  });

  // Listen to pull request events
  app.on("pull_request.opened", async (context) => {
    app.log.info("Pull request opened event received");

    const prComment = context.issue({
      body: "Hello World! 👋 SmartEquip AI is now watching this pull request.",
    });

    return context.octokit.issues.createComment(prComment);
  });
};
