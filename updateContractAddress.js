const fs = require("fs");
const path = require("path");

const votingJsonPath = path.resolve(__dirname, "build/contracts/Voting.json");
const outputPath = path.resolve(__dirname, "src/contractAddress.js");

const votingJson = JSON.parse(fs.readFileSync(votingJsonPath, "utf8"));

const networkId = "5777";
const contractAddress = votingJson.networks[networkId]?.address;

if (!contractAddress) {
  throw new Error(`Contract address not found for network ID ${networkId}`);
}


const outputContent = `window.contractAddress = "${contractAddress}";\n`;
fs.writeFileSync(outputPath, outputContent, "utf8");

console.log(`Contract address updated: ${contractAddress}`);
