const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployMedical", (m) => {
    const admin = m.getAccount(0);
    const contract = m.contract("ReportValidator", [admin]);
    return { contract };
});
