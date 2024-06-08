const fs = require('fs');
const path = require('path');

function sanitizeInput(input, variableName) {
  if (input === undefined) {
    throw new Error(`Input is undefined for variable: ${variableName}`);
  }
  return input.replace(/[^a-zA-Z0-9_\-\/\.]/g, ''); // Allow slashes, alphanumerics, underscore, hyphen, and period
}

function writeEnvironmentReport() {
  return `
# ${process.env.GITHUB_REPOSITORY}

(by: ${process.env.GITHUB_ACTOR} (🤖))

Hey there, wonderful human! 🤖 It's your friendly robot, ${process.env.GITHUB_ACTOR}, beaming in from the brilliant mind of ${process.env.GITHUB_REPOSITORY_OWNER} (🧠). I'm here to give you a delightful tour of our exciting project!

✨ **What's Buzzing in Our Hive?**

🌿 Branch: \`${process.env.GITHUB_REF_NAME}\`
🏷️ Repository: \`${process.env.GITHUB_REPOSITORY}\`
🔧 Workflow Name: \`${process.env.GITHUB_WORKFLOW}\`
🏃 Run ID: \`${process.env.GITHUB_RUN_ID}\`
🔢 Run Number: \`${process.env.GITHUB_RUN_NUMBER}\`
🔁 Run Attempt: \`${process.env.GITHUB_RUN_ATTEMPT}\`

Now, sit back, relax, and let me walk you through some intriguing insights and updates. Without further ado, let's dive into...

`;
}

function writeSetupReport() {
  return `
## ${process.env.GITHUB_REF_NAME} Setup Report

🐳 Devel: \`docker pull ${process.env.GITHUB_REPOSITORY_OWNER}/${process.env.APP_NAME}:${process.env.IMAGE_TAG}\`

> Add a sploosh of ❤️, enrich it with a drop of 🧪, and its going to be amazing! Stay tuned for more updates and keep being awesome!

`;
}

function writeBuilderReport() {
  return `
## ${process.env.GITHUB_REF_NAME} Builder Report

🐳 Builder: \`docker pull ${process.env.GITHUB_REPOSITORY_OWNER}/${process.env.APP_NAME}:${process.env.IMAGE_TAG}\`

> This builder image acts as a stem-cell, (💱) and it the base for something new!

`;
}

function writeDevelReport() {
  return `
## ${process.env.GITHUB_REF_NAME} Devel Report

🐳 Devel: \`docker pull ${process.env.GITHUB_REPOSITORY_OWNER}/${process.env.APP_NAME}:${process.env.IMAGE_TAG}\`

> This image acts as a progenitor-cell, that means it's time to experiment (👨‍💻💱🧪) and change reality! Stay tuned for more updates and keep being awesome!

`;
}

function writeTestReport() {
  return `
## ${process.env.GITHUB_REF_NAME} Test Report

🐳 Test: \`docker pull ${process.env.GITHUB_REPOSITORY_OWNER}/${process.env.APP_NAME}:${process.env.IMAGE_TAG}\`

> This image acts as a precursor-cell, we should have other cells determine if it fits and solves something!

`;
}

function writeProdReport() {
  return `
## ${process.env.GITHUB_REF_NAME} Prod Report

🐳 Prod: \`docker pull ${process.env.GITHUB_REPOSITORY_OWNER}/${process.env.APP_NAME}:${process.env.IMAGE_TAG}\`

> This image is the latest release into the wild environment called life!

`;
}

function writeReleaseReport() {
  return `
## ${process.env.GITHUB_REF_NAME} Release Report 

A new Release is now available:

🐳 Release: \`docker pull ${process.env.GITHUB_REPOSITORY_OWNER}/${process.env.APP_NAME}:${process.env.IMAGE_TAG}\`

`;
}

function writeFinalReport() {
  return `
## Final Report (by: ${process.env.GITHUB_ACTOR} (🤖))

And the verdict is: after some heavy lifting.. 

(by: ${process.env.GITHUB_ACTOR} (🤖))

`;
}

function generateReport(jobType) {
  let reportContent;
  if (jobType === 'environment_setup') {
    reportContent = writeEnvironmentReport();
  } else if (jobType === 'setup') {
    reportContent = writeSetupReport();
  } else if (jobType === 'builder') {
      reportContent = writeBuilderReport();
  } else if (jobType === 'devel') {
    reportContent = writeDevelReport();
  } else if (jobType === 'test') {
    reportContent = writeTestReport();
  } else if (jobType === 'prod') {
    reportContent = writeProdReport();
  } else if (jobType === 'release') {
    reportContent = writeReleaseReport();
  } else {
    reportContent = writeFinalReport();
  }

  console.log('Generated report content:', reportContent);
  return reportContent;
}

function saveReport(reportDir, reportFile, reportContent) {
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  const reportPath = path.join(reportDir, reportFile);
  fs.writeFileSync(reportPath, reportContent);
}

try {
  if (!process.env.INPUT_REPORT_DIR) {
    throw new Error('INPUT_REPORT_DIR is not defined');
  }
  if (!process.env.INPUT_REPORT_FILE) {
    throw new Error('INPUT_REPORT_FILE is not defined');
  }
  if (!process.env.INPUT_JOB_TYPE) {
    throw new Error('INPUT_JOB_TYPE is not defined');
  }

  console.log('INPUT_REPORT_DIR:', process.env.INPUT_REPORT_DIR);
  console.log('INPUT_REPORT_FILE:', process.env.INPUT_REPORT_FILE);
  console.log('INPUT_JOB_TYPE:', process.env.INPUT_JOB_TYPE);

  const reportDir = sanitizeInput(process.env.INPUT_REPORT_DIR, 'INPUT_REPORT_DIR');
  const reportFile = sanitizeInput(process.env.INPUT_REPORT_FILE, 'INPUT_REPORT_FILE');
  const jobType = sanitizeInput(process.env.INPUT_JOB_TYPE, 'INPUT_JOB_TYPE');
  const reportContent = generateReport(jobType);
  console.log('Writing report to:', path.join(reportDir, reportFile));
  saveReport(reportDir, reportFile, reportContent);
  console.log(`Report successfully written to ${path.join(reportDir, reportFile)}`);

  // Use environment file to set the output variable
  const envOutputPath = process.env.GITHUB_OUTPUT;
  fs.appendFileSync(envOutputPath, `report-content=${reportContent.replace(/\n/g, '%0A')}\n`);
} catch (error) {
  console.error('Error writing report:', error.message);
  process.exit(1);
}
