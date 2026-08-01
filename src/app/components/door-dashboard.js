"use client";

import { useEffect, useState } from "react";
import { onValue, ref, set } from "firebase/database";

import { db } from "@/lib/firebase";

export default function DoorDashboard({ email, logoutAction }) {
  const [device, setDevice] = useState({});
  const [control, setControl] = useState({});

  useEffect(() => {
    const unsubscribeDevice = onValue(ref(db, "device"), (snapshot) => setDevice(snapshot.val() || {}));
    const unsubscribeControl = onValue(ref(db, "control"), (snapshot) => setControl(snapshot.val() || {}));
    return () => {
      unsubscribeDevice();
      unsubscribeControl();
    };
  }, []);

  const isDoorUnlocked = Boolean(control.servo);
  const hasMotion = Boolean(device.motion);

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Smart Door</p>
          <h1>Door dashboard</h1>
          <p className="muted">Live access and sensor overview</p>
        </div>
        <div className="account-actions">
          <span>{email}</span>
          <form action={logoutAction}><button className="text-button" type="submit">Log out</button></form>
        </div>
      </header>

      <section className="status-banner">
        <span className={`status-dot ${hasMotion ? "warning" : ""}`} />
        <span>{hasMotion ? "Motion detected near the door" : "All clear — no motion detected"}</span>
      </section>

      <section className="metrics-grid" aria-label="Door status">
        <article className="metric-card">
          <p className="metric-label">Door status</p>
          <p className="metric-value">{isDoorUnlocked ? "Unlocked" : "Locked"}</p>
          <p className="metric-detail">Servo control is {isDoorUnlocked ? "active" : "secured"}</p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Distance sensor</p>
          <p className="metric-value">{device.distance ?? "—"}<small>{device.distance != null ? " cm" : ""}</small></p>
          <p className="metric-detail">Latest proximity reading</p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Motion sensor</p>
          <p className="metric-value">{hasMotion ? "Detected" : "Clear"}</p>
          <p className="metric-detail">Live PIR sensor state</p>
        </article>
      </section>

      <section className="controls-card" aria-labelledby="controls-heading">
        <div><p className="eyebrow">Remote control</p><h2 id="controls-heading">Door controls</h2></div>
        <div className="controls">
          <button className="primary-button" onClick={() => set(ref(db, "control/servo"), !isDoorUnlocked)}>
            {isDoorUnlocked ? "Lock door" : "Unlock door"}
          </button>
          <button className={`secondary-button ${control.buzzer ? "active" : ""}`} onClick={() => set(ref(db, "control/buzzer"), !control.buzzer)}>
            {control.buzzer ? "Turn buzzer off" : "Sound buzzer"}
          </button>
        </div>
      </section>
    </main>
  );
}
