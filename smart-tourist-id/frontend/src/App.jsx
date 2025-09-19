import React from "react";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App(){
  return (
    <div style={{padding:20}}>
      <h1>Smart Tourist Safety (Prototype)</h1>
      <div style={{display:'flex', gap:40}}>
        <div style={{flex:1}}><Register /></div>
        <div style={{flex:1}}><Dashboard /></div>
      </div>
    </div>
  );
}
