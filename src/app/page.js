"use client";

import { useEffect, useState } from "react";

import { db } from "@/lib/firebase";

import {
  ref,
  onValue,
  set
} from "firebase/database";

export default function Home() {

  const [device, setDevice] = useState({});

  const [control, setControl] = useState({});

  useEffect(() => {

    onValue(ref(db, "device"), snapshot => {
      setDevice(snapshot.val());
    });

    onValue(ref(db, "control"), snapshot => {
      setControl(snapshot.val());
    });

  }, []);

  return (

    <main className="max-w-5xl mx-auto p-10">

      <h1 className="text-4xl font-bold">
        Smart Door Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-6 mt-10">

        <div className="border rounded-xl p-6">

          <h2>Distance</h2>

          <p className="text-5xl">
            {device.distance} cm
          </p>

        </div>

        <div className="border rounded-xl p-6">

          <h2>Motion</h2>

          <p>
            {device.motion ? "Detected" : "No Motion"}
          </p>

        </div>

      </div>

      <div className="mt-10 space-x-5">

        <button

          onClick={() => set(ref(db, "control/servo"), !control.servo)}

          className="bg-blue-600 text-white px-5 py-3 rounded"

        >

          {control.servo ? "Lock Door" : "Unlock Door"}

        </button>

        <button

          onClick={() => set(ref(db, "control/buzzer"), !control.buzzer)}

          className="bg-red-600 text-white px-5 py-3 rounded"

        >

          {control.buzzer ? "Buzzer On":"Buzzer off"}

        </button>

      </div>

    </main>

  );

}