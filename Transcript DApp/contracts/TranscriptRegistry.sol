// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TranscriptRegistry {
    address public owner;
    mapping(address => bool) public registrars;

    struct Certificate {
        bytes32 id;         // unique id (e.g., keccak256)
        address issuer;     // registrar account
        address recipient;  // owner of certificate (optional)
        string uri;         // IPFS CID or URL or metadata hash
        uint256 timestamp;
        bool revoked;
        bool exists;
    }

    mapping(bytes32 => Certificate) private certificates;

    event RegistrarAdded(address indexed registrar);
    event RegistrarRemoved(address indexed registrar);
    event CertificateIssued(bytes32 indexed id, address indexed issuer, address indexed recipient, string uri);
    event CertificateRevoked(bytes32 indexed id, address indexed issuer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyRegistrar() {
        require(registrars[msg.sender], "Only registrar");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Owner manages registrars
    function addRegistrar(address _registrar) external onlyOwner {
        require(_registrar != address(0), "Zero address");
        registrars[_registrar] = true;
        emit RegistrarAdded(_registrar);
    }

    function removeRegistrar(address _registrar) external onlyOwner {
        require(registrars[_registrar], "Not a registrar");
        registrars[_registrar] = false;
        emit RegistrarRemoved(_registrar);
    }

    // Registrar issues a certificate with a unique id (bytes32)
    function issueCertificate(bytes32 id, address recipient, string calldata uri) external onlyRegistrar {
        require(id != bytes32(0), "Invalid id");
        require(!certificates[id].exists, "Already issued");
        certificates[id] = Certificate({
            id: id,
            issuer: msg.sender,
            recipient: recipient,
            uri: uri,
            timestamp: block.timestamp,
            revoked: false,
            exists: true
        });
        emit CertificateIssued(id, msg.sender, recipient, uri);
    }

    // Registrar may revoke
    function revokeCertificate(bytes32 id) external onlyRegistrar {
        require(certificates[id].exists, "Not issued");
        require(!certificates[id].revoked, "Already revoked");
        certificates[id].revoked = true;
        emit CertificateRevoked(id, msg.sender);
    }

    // Public view to fetch certificate data
    function getCertificate(bytes32 id) external view returns (
        bytes32 certId,
        address issuer,
        address recipient,
        string memory uri,
        uint256 timestamp,
        bool revoked,
        bool exists
    ) {
        Certificate storage c = certificates[id];
        require(c.exists, "Certificate not found");
        return (c.id, c.issuer, c.recipient, c.uri, c.timestamp, c.revoked, c.exists);
    }

    // Verify: returns (exists, revoked, issuer, recipient, uri, timestamp)
    function verify(bytes32 id) external view returns (bool exists, bool revoked, address issuer, address recipient, string memory uri, uint256 timestamp) {
        Certificate storage c = certificates[id];
        if (!c.exists) return (false, false, address(0), address(0), "", 0);
        return (true, c.revoked, c.issuer, c.recipient, c.uri, c.timestamp);
    }
}
