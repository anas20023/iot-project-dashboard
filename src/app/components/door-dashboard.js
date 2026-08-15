"use client";

import { useEffect, useState } from "react";
import { onValue, ref, set } from "firebase/database";

import { db } from "@/lib/firebase";

function formatTimestamp(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function DoorDashboard({ email, logoutAction }) {
  const [device, setDevice] = useState({});
  const [control, setControl] = useState({});
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const unsubscribeDevice = onValue(ref(db, "device"), (snapshot) => setDevice(snapshot.val() || {}));
    const unsubscribeControl = onValue(ref(db, "control"), (snapshot) => setControl(snapshot.val() || {}));
    const unsubscribeLogs = onValue(ref(db, "accessLogs"), (snapshot) => {
      const data = snapshot.val();
      if (!data) { setLogs([]); return; }
      const sorted = Object.entries(data)
        .map(([id, entry]) => ({ id, ...entry }))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);
      setLogs(sorted);
    });
    return () => {
      unsubscribeDevice();
      unsubscribeControl();
      unsubscribeLogs();
    };
  }, []);

  const isDoorUnlocked = Boolean(control.servo);

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



      <section className="metrics-grid" aria-label="Door status">
        <article className="metric-card">
          <p className="metric-label">Door status</p>
          <p className="metric-value">{isDoorUnlocked ? "Unlocked" : "Locked"}</p>
          <p className="metric-detail">Servo control is {isDoorUnlocked ? "active" : "secured"}</p>
        </article>

        <article className="metric-card">
          <p className="metric-label">Device status</p>
          <p className="metric-value metric-value--status">{device.status ?? "—"}</p>
          <p className="metric-detail">Last seen {device.lastSeen != null ? `${device.lastSeen}s ago` : "—"}</p>
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

      <section className="logs-card" aria-labelledby="logs-heading">
        <div className="logs-header">
          <div>
            <p className="eyebrow">Security</p>
            <h2 id="logs-heading">Recent access logs</h2>
            <p className="muted">Last {logs.length} events from {device.device ?? "ESP32-S3-CAM"}</p>
          </div>
          <span className="logs-count">{logs.length} / 10</span>
        </div>

        {logs.length === 0 ? (
          <p className="logs-empty">No access events recorded yet.</p>
        ) : (
          <div className="logs-table-wrap">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Name</th>
                  <th>Result</th>
                  <th>Confidence</th>
                  <th>Device</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="log-ts">{formatTimestamp(log.timestamp)}</td>
                    <td className="log-name">{log.name ?? "—"}</td>
                    <td>
                      <span className={`log-badge ${log.result === "access_granted" ? "badge-granted" : "badge-denied"}`}>
                        {log.result === "access_granted" ? "Granted" : "Denied"}
                      </span>
                    </td>
                    <td className="log-confidence">
                      <div className="confidence-bar-wrap">
                        <div className="confidence-bar" style={{ width: `${Math.min(log.confidence ?? 0, 100)}%` }} />
                        <span>{log.confidence ?? 0}%</span>
                      </div>
                    </td>
                    <td className="log-device">{log.device ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
