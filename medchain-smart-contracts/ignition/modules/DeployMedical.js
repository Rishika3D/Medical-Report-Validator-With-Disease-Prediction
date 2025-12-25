const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployMedical", (m) => {
const contract = m.contract("ReportValidator"); // e.g., "ReportValidator" or your contract name
return { contract };
});
