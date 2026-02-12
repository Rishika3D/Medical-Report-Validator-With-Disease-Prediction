// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract ReportValidator is AccessControl {
    bytes32 public constant UPLOADER_ROLE = keccak256("UPLOADER_ROLE");

    struct Report {
        bytes32 contentHash; // SHA-256 of canonicalized content, hex -> bytes32
        bytes   cid;         // CIDv1 raw bytes
        uint64  timestamp;   // unix seconds
        bool    isRepudiated; // Status of the report
        string  repudiationReason; // Reason for repudiation
    }

    mapping(address => Report[]) private _reports;

    event ReportUploaded(
        address indexed uploader,
        address indexed subject,
        bytes32 indexed contentHash,
        bytes cid,
        uint64 timestamp
    );

    event ReportRepudiated(
        address indexed subject,
        uint256 indexed reportIndex,
        string reason,
        address admin
    );

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPLOADER_ROLE, admin);
    }

    function uploadReport(
        address subject,
        bytes32 contentHash,
        bytes calldata cidBytes
    ) external onlyRole(UPLOADER_ROLE) {
        require(subject != address(0), "bad subject");
        require(contentHash != bytes32(0), "bad hash");
        require(cidBytes.length > 0, "bad cid");

        _reports[subject].push(Report({
            contentHash: contentHash,
            cid: cidBytes,
            timestamp: uint64(block.timestamp),
            isRepudiated: false,
            repudiationReason: ""
        }));

        emit ReportUploaded(msg.sender, subject, contentHash, cidBytes, uint64(block.timestamp));
    }

    function repudiateReport(address subject, uint256 index, string calldata reason) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(index < _reports[subject].length, "Report does not exist");
        Report storage report = _reports[subject][index];
        require(!report.isRepudiated, "Report already repudiated");

        report.isRepudiated = true;
        report.repudiationReason = reason;

        emit ReportRepudiated(subject, index, reason, msg.sender);
    }

    function getLatestReport(address user)
        external
        view
        returns (
        bytes32 contentHash, 
        bytes memory cid, 
        uint64 timestamp, 
        bool isRepudiated, 
        string memory repudiationReason
    )
    {
        uint256 len = _reports[user].length;
        require(len > 0, "no reports");
        Report storage r = _reports[user][len - 1];
        return (r.contentHash, r.cid, r.timestamp, r.isRepudiated, r.repudiationReason);
    }

    function verifyReport(address user, uint256 index, bytes32 expectedHash)
        external
        view
        returns (bool)
    {
        require(index < _reports[user].length, "oob");
        return _reports[user][index].contentHash == expectedHash;
    }

    function reportsCount(address user) external view returns (uint256) {
        return _reports[user].length;
    }
}
