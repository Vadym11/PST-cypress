#!/usr/bin/env node

const fs = require("fs");
const { spawn } = require("child_process");

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;
const TEST_NAME = process.env.TEST_NAME || "Cypress test run";

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

async function sendSlackNotification({ exitCode, durationMs }) {
  if (!SLACK_WEBHOOK) {
    console.log("SLACK_WEBHOOK not set, skipping Slack notification.");
    return;
  }

  const success = exitCode === 0;
  const durationHHMMSS = formatDuration(durationMs);

  const descriptors = success
    ? { icon: ":tada:", text: "passed" }
    : { icon: ":red_circle:", text: "failed" };

  const messageLines = [
    `*Test run:* ${TEST_NAME}`,
    `*Status:* ${success ? "PASSED" : "FAILED"}`,
    `*Exit code:* ${exitCode}`,
    `*Duration:* ${durationHHMMSS}`,
  ];

  let resultString = messageLines.join("\n");
  if (resultString.length > 3000) {
    resultString = `${resultString.substring(0, 2997)}...`;
  }

  try {
    const response = await fetch(SLACK_WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${descriptors.icon} ${TEST_NAME} has *${descriptors.text}*.`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: resultString,
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Slack webhook returned HTTP ${response.status}`);
    }

    console.log("Slack notification sent.");
  } catch (err) {
    console.error("Failed to send Slack notification:", err.message || err);
  }
}

(async () => {
  console.log("Starting Cypress test run...");
  console.log("TEST_NAME:", TEST_NAME);
  console.log("SLACK_WEBHOOK set:", Boolean(SLACK_WEBHOOK));

  const start = Date.now();
  const proc = spawn("npm", ["run", "test:all", "--", "--browser", "chrome"], {
    stdio: "inherit",
  });

  proc.on("close", async (code) => {
    const normalizedCode = typeof code === "number" ? code : 1;
    const durationMs = Date.now() - start;

    console.log(
      `Cypress finished with exit code ${normalizedCode}, duration ${durationMs}ms`
    );

    await sendSlackNotification({
      exitCode: normalizedCode,
      durationMs,
    });

    fs.writeFileSync("/tests/tests_finished.txt", String(normalizedCode));

    const delayMinutes = 3;
    console.log(
      `Waiting ${delayMinutes} minutes for artifact collection before exiting...`
    );

    setTimeout(() => {
      console.log("Exiting now.");
      process.exit(normalizedCode);
    }, delayMinutes * 60 * 1000);
  });

  proc.on("error", (err) => {
    console.error("Failed to start Cypress process:", err);
    process.exit(1);
  });
})();
