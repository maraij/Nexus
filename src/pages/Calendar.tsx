import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { getData, saveData } from "../utils/meetingStorage";
import { MeetingState } from "../utils/meetingTypes";

export default function Calendar() {
  const [data, setData] = useState<MeetingState>(getData());

  // 🟢 ADD AVAILABILITY SLOT
  const addSlot = (info: any) => {
    const updated = {
      ...data,
      availability: [
        ...data.availability,
        { id: Date.now().toString(), date: info.dateStr }
      ]
    };

    setData(updated);
    saveData(updated);
  };

  // 🟡 SEND MEETING REQUEST
  const sendRequest = (date: string) => {
    const title = prompt("Enter meeting title:");
    if (!title) return;

    const updated = {
      ...data,
      requests: [
        ...data.requests,
        {
          id: Date.now().toString(),
          title,
          date,
          status: "pending"
        }
      ]
    };

    setData(updated);
    saveData(updated);
  };

  // 🔵 ACCEPT / REJECT
  const updateStatus = (id: string, status: "accepted" | "rejected") => {
    const updated = {
      ...data,
      requests: data.requests.map((r) =>
        r.id === id ? { ...r, status } : r
      )
    };

    setData(updated);
    saveData(updated);
  };

  return (
    <div className="p-6 grid grid-cols-3 gap-6">

      {/*  CALENDAR */}
      <div className="col-span-2 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-3">
          Meeting System 
        </h2>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          
          // 🟢 Add availability
          dateClick={addSlot}
        />
      </div>

      {/* 📌 SIDE PANEL */}
      <div className="bg-white p-4 rounded shadow space-y-6">

        {/* 🟢 Availability */}
        <div>
          <h3 className="font-bold">Availability Slots</h3>
          {data.availability.map((a) => (
            <p key={a.id} className="text-sm text-gray-600">
              📌 {a.date}
              <button
                onClick={() => sendRequest(a.date)}
                className="ml-2 text-blue-500 text-xs"
              >
                Send Request
              </button>
            </p>
          ))}
        </div>

        {/* 🟡 Requests */}
        <div>
          <h3 className="font-bold">Meeting Requests</h3>

          {data.requests.map((r) => (
            <div key={r.id} className="border p-2 rounded mb-2">
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-gray-500">{r.date}</p>

              <p className="text-xs mt-1">
                Status: {r.status}
              </p>

              {r.status === "pending" && (
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => updateStatus(r.id, "accepted")}
                    className="bg-green-500 text-white text-xs px-2 py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(r.id, "rejected")}
                    className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}