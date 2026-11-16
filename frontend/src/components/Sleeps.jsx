import { useState } from "react";

export function SleepForm({ onCreated }) {
  const [sleepDate, setSleepDate] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [hours, setHours] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/sleeps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sleep_date: sleepDate,
        hours: Number(hours),
        quality: Number(sleepQuality),
      }),
    });
    if (res.ok) {
      const created = await res.json();
      onCreated(created);
      setSleepDate("");
      setSleepQuality("");
      setHours("");
      setError("");
    } else {
      setError("Invalid input — check all fields.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={sleepDate}
        onChange={(e) => setSleepDate(e.target.value)}
      />
      <input
        placeholder="Quality (1 - 5)"
        type="number"
        value={sleepQuality}
        onChange={(e) => setSleepQuality(e.target.value)}
      />
      <input
        placeholder="Hours (hrs)"
        type="number"
        step="0.5"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />

      <button type="submit">Add Sleep</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export function SleepItem({ sleep, onDeleted, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState(sleep.sleep_date);
  const [editHours, setEditHours] = useState(sleep.hours);
  const [editQuality, setEditQuality] = useState(sleep.quality);
  async function handleDelete() {
    const res = await fetch(`/api/sleeps/${sleep.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      onDeleted(sleep.id);
    }
  }

  async function handleSave() {
    const res = await fetch(`/api/sleeps/${sleep.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sleep_date: editDate,
        hours: Number(editHours),
        quality: Number(editQuality),
      }),
    });
    if (res.ok) {
      onUpdated(await res.json());
      setIsEditing(false);
    }
  }

  return isEditing ? (
    <li>
      <input
        type="date"
        value={editDate}
        onChange={(e) => setEditDate(e.target.value)}
      />

      <input
        type="number"
        step="0.5"
        value={editHours}
        onChange={(e) => setEditHours(e.target.value)}
      />
      <input
        type="number"
        value={editQuality}
        onChange={(e) => setEditQuality(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={() => setIsEditing(false)}>Cancel</button>
    </li>
  ) : (
    <li>
      {sleep.sleep_date}, {sleep.hours} hrs (Quality {sleep.quality})
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}
