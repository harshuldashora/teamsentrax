import React, { useState } from "react";
import axios from "axios";

export default function Register(){
  const [form, setForm] = useState({ name:'', age:25, gender:'M', emergencyContact:'', tripFrom:'', tripTo:'', durationDays:5 });
  const [resp, setResp] = useState(null);

  async function submit(){
    try {
      const r = await axios.post('http://localhost:4000/api/create', form);
      setResp(r.data);
    } catch(e){ setResp({error: e.message}); }
  }

  return (
    <div>
      <h2>Register Tourist</h2>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /><br/>
      <input placeholder="Age" type="number" value={form.age} onChange={e=>setForm({...form,age:Number(e.target.value)})} /><br/>
      <input placeholder="Emergency Contact" value={form.emergencyContact} onChange={e=>setForm({...form,emergencyContact:e.target.value})} /><br/>
      <input placeholder="From" value={form.tripFrom} onChange={e=>setForm({...form,tripFrom:e.target.value})} /><br/>
      <input placeholder="To" value={form.tripTo} onChange={e=>setForm({...form,tripTo:e.target.value})} /><br/>
      <button onClick={submit}>Create</button>
      <pre>{JSON.stringify(resp, null, 2)}</pre>
    </div>
  );
}
