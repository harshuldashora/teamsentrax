import React, { useState } from "react";
import axios from "axios";

export default function Dashboard(){
  const [id, setId] = useState('');
  const [meta, setMeta] = useState(null);
  async function loadMeta(){
    try {
      const r = await axios.get(`http://localhost:4000/api/meta/${id}`);
      setMeta(r.data);
    } catch(e){ setMeta({error: e.message}); }
  }
  async function requestEmergency(){
    await axios.post('http://localhost:4000/api/request-emergency', { id: Number(id), reason: "Emergency by authority" });
  }
  return (
    <div>
      <h2>Authority Dashboard</h2>
      <input placeholder="Record ID" value={id} onChange={e=>setId(e.target.value)} />
      <button onClick={loadMeta}>Load Meta</button>
      <button onClick={requestEmergency}>Request Emergency Access</button>
      <pre>{JSON.stringify(meta, null, 2)}</pre>
    </div>
  );
}
