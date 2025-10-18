# 🎓 Transcript Verification DApp using Solidity and Hardhat

### Author
**Mohammed Faizal**  
Roll No: 2101CS86  
Course: CS577 — Blockchain Technologies  
Indian Institute of Technology, Patna  

---

## 📘 Project Overview
This project implements a **Blockchain-based Transcript Verification System** using **Solidity**, **Hardhat**, and **Ethers.js**.  
It enables academic institutions to issue and revoke student transcripts, while anyone can verify them on-chain.  
The system ensures transparency, immutability, and trust through Ethereum smart contracts.

---

## 🛠️ Tech Stack
| Component | Technology Used |
|------------|------------------|
| Smart Contract | Solidity |
| Framework | Hardhat |
| Frontend | HTML + JavaScript (Ethers.js) |
| Wallet | MetaMask |
| Server | Node.js (http-server) |
| Blockchain Network | Localhost (Hardhat Node) |

---

## ⚙️ Installation and Setup

### 1. Clone Repository
```bash
git clone https://github.com/<your-username>/transcript-dapp.git
cd transcript-dapp
```

### 2. Install Dependencies
```bash
npm install --save-dev hardhat@^2.17.0 @nomicfoundation/hardhat-toolbox@^3.0.0 ethers@^6.9.2 chai dotenv --legacy-peer-deps
```

---

## 🧩 Configuration

Create a file named **`hardhat.config.cjs`** in the root folder:

```js
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
```

---

## 🧱 Compile, Test, and Deploy

### 1. Compile Smart Contracts
```bash
npx hardhat compile
```

### 2. Run Unit Tests
```bash
npx hardhat test
```

### 3. Start Local Blockchain
```bash
npx hardhat node
```

### 4. Deploy Contract (in a new terminal)
```bash
npx hardhat run scripts/deploy-transcript.cjs --network localhost
```

Expected output:
```
TranscriptRegistry deployed to: 0x...
ABI and address written to frontend-transcript/contract.json
```

---

## 🌐 Running the Frontend

### 1. Start Local Server
```bash
npx http-server ./frontend-transcript -p 4000
```

### 2. Open in Browser
```
http://127.0.0.1:4000/index.html
```

---

## 🔗 MetaMask Setup

1. Open MetaMask → **Add Network Manually**  
   - Network Name: `Hardhat Local`  
   - RPC URL: `http://127.0.0.1:8545`  
   - Chain ID: `31337`  
   - Currency Symbol: `ETH`

2. Import one of the private keys shown in the Hardhat node console (Account #0 as Owner).

3. Refresh the DApp and click **Connect**.

---

## 🧮 Using the DApp

### 👨‍🏫 Owner Actions
- Click **Add Myself as Registrar** → Approve in MetaMask.

### 🧾 Registrar Actions
1. Enter transcript details:
   - **Raw Data** (e.g. `faizal-transcript-001`)
   - **Metadata URI** (e.g. `ipfs://QmExampleCID`)
2. Click **Issue Certificate** → Approve.
3. To revoke, enter the same ID and click **Revoke Certificate**.

### 🔍 Verification
- Enter transcript ID (or raw text).
- Click **Verify**.
- Results display as JSON showing:
  ```json
  {
    "exists": true,
    "revoked": false,
    "issuer": "0x...",
    "uri": "ipfs://..."
  }
  ```

---

## 🧪 Sample Test Cases
| Test Case | Expected Result |
|------------|------------------|
| Add Registrar (Owner) | Registrar added successfully |
| Issue Certificate | Transaction confirmed, ID displayed |
| Verify Certificate | Displays correct data |
| Revoke Certificate | Shows `"revoked": true` |

---

## 🧰 Troubleshooting
| Problem | Solution |
|----------|-----------|
| **HHE3: No Hardhat config found** | Create `hardhat.config.cjs` as shown above |
| **MetaMask not connecting** | Approve pending connection popup |
| **Directory listing in browser** | Open `/index.html` directly |
| **showResults BAD_DATA error** | Redeploy contract and update `frontend-transcript/contract.json` |

---

## 🚀 Deploying to Sepolia (Optional)
1. Create `.env` in project root:
   ```
   SEPOLIA_RPC_URL=<Your_Alchemy_or_Infura_URL>
   PRIVATE_KEY=<Your_MetaMask_Private_Key>
   ```
2. Update `hardhat.config.cjs`:
   ```js
   networks: {
     sepolia: {
       url: process.env.SEPOLIA_RPC_URL,
       accounts: [process.env.PRIVATE_KEY]
     }
   }
   ```
3. Deploy:
   ```bash
   npx hardhat run scripts/deploy-transcript.cjs --network sepolia
   ```

---

## 📁 Project Structure

```
transcript-dapp/
│
├── contracts/
│   └── TranscriptRegistry.sol
│
├── scripts/
│   └── deploy-transcript.cjs
│
├── test/
│   └── transcript.test.cjs
│
├── frontend-transcript/
│   ├── index.html
│   ├── app.js
│   ├── contract.json
│
├── hardhat.config.cjs
├── package.json
└── README.md
```

---

## 📜 License
This project is for **academic and educational use**.  
Free to modify and extend with attribution.

---

## 👨‍💻 Developer
**Mohammed Faizal**  
Indian Institute of Technology, Patna  
*Developed as part of Blockchain Technologies (CS577) coursework.*
