// frontend/app.js -- no import, no assert

(async function main() {
  const r = await fetch("./contract.json");
  if (!r.ok) {
    document.body.innerHTML = "<h3>contract.json missing</h3>";
    return;
  }
  const cdata = await r.json();

  if (!window.ethereum) {
    document.body.innerHTML = "<h3>MetaMask not detected</h3>";
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  let signer, contract;

  async function connect() {
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    const acc = await signer.getAddress();
    document.getElementById("account").innerText = "Connected: " + acc;
    contract = new ethers.Contract(cdata.address, cdata.abi, signer);
    await refresh();
  }

  async function refresh() {
    if (!contract) return;
    const [ids, names, votes] = await contract.showResults();
    const list = document.getElementById("candidatesList");
    const sel = document.getElementById("candidateSelect");
    list.innerHTML = "";
    sel.innerHTML = "";
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i].toString();
      const name = names[i];
      const v = votes[i].toString();
      list.innerHTML += `#${id} ${name} — ${v} votes<br>`;
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = `${name} (#${id})`;
      sel.appendChild(opt);
    }
  }

  document.getElementById("registerCandidateBtn").onclick = async () => {
    await connect();
    const name = document.getElementById("candidateName").value.trim();
    if (!name) return alert("Enter name");
    const tx = await contract.registerCandidate(name);
    await tx.wait();
    await refresh();
  };

  document.getElementById("registerVoterBtn").onclick = async () => {
    await connect();
    const addr = document.getElementById("voterAddress").value.trim();
    if (!addr) return alert("Enter address");
    const tx = await contract.registerVoter(addr);
    await tx.wait();
    alert("Voter registered");
  };

  document.getElementById("voteBtn").onclick = async () => {
  try {
    // read selected candidate first
    const sel = document.getElementById("candidateSelect");
    const candidateId = parseInt(sel.value);
    if (!candidateId) return alert("Select candidate");

    // ensure MetaMask and contract are ready
    if (!window.ethereum) return alert("MetaMask not detected");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    // load contract again with signer
    const res = await fetch("./contract.json");
    const contractJson = await res.json();
    const contract = new ethers.Contract(contractJson.address, contractJson.abi, signer);

    // send vote tx
    const tx = await contract.vote(candidateId);
    await tx.wait();
    alert("Vote cast successfully");

    // refresh UI after vote
    await refresh();
  } catch (err) {
    console.error(err);
    alert("Voting failed: " + (err.reason || err.message));
  }
};



  document.getElementById("refreshBtn").onclick = refresh;

  try { await connect(); } catch {}
})();
