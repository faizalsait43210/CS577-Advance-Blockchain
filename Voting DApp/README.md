# 🗳️ Decentralized Voting DApp using Solidity and Hardhat

### Author
**Mohammed Faizal**  
Roll No: 2101CS86  
Course: CS577 — Blockchain Technologies  
Department of Computer Science and Engineering  
Indian Institute of Technology, Patna  

---

## 📘 Overview
This project implements a **Decentralized Voting Application (DApp)** using **Solidity**, **Hardhat**, and **Ethers.js**.  
It allows a contract owner to register candidates and voters. Registered voters can securely cast their votes via MetaMask.  
The blockchain ensures transparency, immutability, and verifiable results.

---

## 🛠️ Tech Stack
| Component | Technology Used |
|------------|------------------|
| Smart Contract | Solidity |
| Development Framework | Hardhat |
| Frontend | HTML, JavaScript, Ethers.js |
| Wallet Integration | MetaMask |
| Local Blockchain | Hardhat Network |
| IDE | Visual Studio Code |
| Server | http-server (Node.js) |

---

## ⚙️ Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/voting-dapp.git
cd voting-dapp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Compile the Smart Contract
```bash
npx hardhat compile
```

### 4. Start Local Hardhat Node
```bash
npx hardhat node
```

### 5. Deploy the Contract
In a **new terminal**, run:
```bash
npx hardhat run scripts/deploy.cjs --network localhost
```
Output will include:
```
Voting deployed to: 0x...
ABI and address written to frontend/contract.json
```

---

## 🌐 Running the Frontend
Serve the frontend folder:
```bash
npx http-server ./frontend -p 3000
```

Then open your browser at:
```
http://127.0.0.1:3000
```

---

## 🔗 Connect MetaMask
1. Open **MetaMask → Networks → Add Network manually**
   - **Network Name:** Hardhat Local  
   - **RPC URL:** http://127.0.0.1:8545  
   - **Chain ID:** 31337  
   - **Currency Symbol:** ETH
2. Import one or more private keys shown in the Hardhat node terminal.
3. Connect MetaMask to `http://127.0.0.1:3000`.

---

## 🧩 Using the DApp

### As Owner
1. Enter a candidate name → click **Register Candidate**.  
2. Enter voter wallet address → click **Register Voter**.  

### As Voter
1. Switch MetaMask to a registered voter account.  
2. Choose a candidate from the dropdown.  
3. Click **Vote** and approve the transaction.  

### Viewing Results
Click **Refresh** to view updated vote counts and winners.

---

## 🧪 Testing
Run automated unit tests (optional):
```bash
npx hardhat test
```

Expected output:
```
  Voting
    ✓ owner registers candidates and voters; voting works
    ✓ prevents double voting
    ✓ only owner can register
```

---

## 📁 Project Structure
```
voting-dapp/
│
├── contracts/
│   └── Voting.sol
│
├── scripts/
│   └── deploy.cjs
│
├── test/
│   └── voting.test.cjs
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── contract.json
│   └── style.css (optional)
│
├── hardhat.config.js
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Deploying to Testnet (Optional)
To deploy on **Sepolia**:
1. Create `.env` file:
   ```
   SEPOLIA_RPC_URL=<Your_Infura_or_Alchemy_RPC_URL>
   PRIVATE_KEY=<Your_MetaMask_Private_Key>
   ```
2. Modify `hardhat.config.js`:
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
   npx hardhat run scripts/deploy.cjs --network sepolia
   ```

---

## ⚖️ License
This project is for **academic and educational purposes** only.  
You may reuse or modify it with proper attribution.

---

## 🧠 Future Improvements
- Add authentication for voter registration.
- Store data in IPFS for off-chain verification.
- Implement on-chain result encryption and audit trails.

---

**Developed by:** *Mohammed Faizal (IIT Patna)*  
