(async function(){
  const resp = await fetch('./contract.json');
  if(!resp.ok){ document.body.innerHTML = "<h3>contract.json missing</h3>"; return; }
  const c = await resp.json();

  if(!window.ethereum){ document.getElementById('account').innerText='MetaMask not detected'; return; }
  const provider = new ethers.BrowserProvider(window.ethereum);

  async function connect() {
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    document.getElementById('account').innerText = `Connected: ${addr}`;
    return signer;
  }

  async function getContractWithSigner(signer){
    return new ethers.Contract(c.address, c.abi, signer);
  }

  document.getElementById('addRegistrarBtn').onclick = async ()=>{
    try {
      const signer = await connect();
      const contract = await getContractWithSigner(signer);
      const tx = await contract.addRegistrar(await signer.getAddress());
      await tx.wait();
      alert('Added as registrar (if owner)');
    } catch(e){ alert(e.message || e); console.error(e); }
  };

  document.getElementById('issueBtn').onclick = async ()=>{
    try {
      const signer = await connect();
      const contract = await getContractWithSigner(signer);
      const raw = document.getElementById('raw').value.trim();
      const id = raw.startsWith('0x') ? raw : ethers.keccak256(ethers.toUtf8Bytes(raw || Date.now().toString()));
      const recipient = document.getElementById('recipient').value || ethers.ZeroAddress;
      const uri = document.getElementById('uri').value || "";
      const tx = await contract.issueCertificate(id, recipient, uri);
      await tx.wait();
      alert('Certificate issued. ID: ' + id);
    } catch(e){ alert(e.message || e); console.error(e); }
  };

  document.getElementById('revokeBtn').onclick = async ()=>{
    try {
      const signer = await connect();
      const contract = await getContractWithSigner(signer);
      const raw = document.getElementById('raw').value.trim();
      const id = raw.startsWith('0x') ? raw : ethers.keccak256(ethers.toUtf8Bytes(raw || ""));
      const tx = await contract.revokeCertificate(id);
      await tx.wait();
      alert('Certificate revoked: ' + id);
    } catch(e){ alert(e.message || e); console.error(e); }
  };

  document.getElementById('verifyBtn').onclick = async ()=>{
    try {
      const idraw = document.getElementById('verifyId').value.trim();
      const id = idraw.startsWith('0x') ? idraw : ethers.keccak256(ethers.toUtf8Bytes(idraw));
      const providerReadonly = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const contract = new ethers.Contract(c.address, c.abi, providerReadonly);
      const res = await contract.verify(id);
      if(!res[0]) { document.getElementById('verifyResult').innerText = 'Certificate not found'; return; }
      const out = {
        id,
        exists: res[0],
        revoked: res[1],
        issuer: res[2],
        recipient: res[3],
        uri: res[4],
        timestamp: (new Date(Number(res[5]) * 1000)).toString()
      };
      document.getElementById('verifyResult').innerText = JSON.stringify(out, null, 2);
    } catch(e){ alert(e.message || e); console.error(e); }
  };

  // Try auto-connect display only
  try { await provider.send("eth_accounts", []); } catch(e){}
})();
