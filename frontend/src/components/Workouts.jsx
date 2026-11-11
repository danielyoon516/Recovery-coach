function WorkoutForm({ onCreated }) {
  const [workoutDate, setWorkoutDate] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [rpe, setRpe] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workout_date: workoutDate,
        type: workoutType,
        duration_min: Number(durationMin),
        rpe: Number(rpe),
      }),
    });
    if (res.ok) {
      const created = await res.json();
      onCreated(created);
      setWorkoutDate("");
      setWorkoutType("");
      setDurationMin("");
      setRpe("");
      setError("");
    } else {
      setError("Invalid input — check all fields.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={workoutDate}
        onChange={(e) => setWorkoutDate(e.target.value)}
      />
      <input
        placeholder="Type (e.g. run)"
        value={workoutType}
        onChange={(e) => setWorkoutType(e.target.value)}
      />
      <input
        placeholder="Duration (min)"
        type="number"
        value={durationMin}
        onChange={(e) => setDurationMin(e.target.value)}
      />
      <input
        placeholder="RPE (1–10)"
        type="number"
        value={rpe}
        onChange={(e) => setRpe(e.target.value)}
      />
      <button type="submit">Add Workout</button>
      {error && <p>{error}</p>}
    </form>
  );
}

function WorkoutItem({ workout, onDeleted, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState(workout.type);
  const [editDate, setEditDate] = useState(workout.workout_date);
  const [editDuration, setEditDuration] = useState(workout.duration_min);
  const [editRpe, setEditRpe] = useState(workout.rpe);

  async function handleDelete() {
    const res = await fetch(`/api/workouts/${workout.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      onDeleted(workout.id);
    }
  }

  async function handleSave() {
    const res = await fetch(`/api/workouts/${workout.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workout_date: editDate,
        type: editType,
        duration_min: Number(editDuration),
        rpe: Number(editRpe),
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
      <input value={editType} onChange={(e) => setEditType(e.target.value)} />
      <input
        type="number"
        value={editDuration}
        onChange={(e) => setEditDuration(e.target.value)}
      />
      <input
        type="number"
        value={editRpe}
        onChange={(e) => setEditRpe(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={() => setIsEditing(false)}>Cancel</button>
    </li>
  ) : (
    <li>
      {workout.type}, {workout.duration_min} min (RPE {workout.rpe})
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

function TotalDuration({ workouts }) {
  let total = 0;
  for (const w of workouts) {
    total += w.duration_min;
  }
  return <p>Total: {total} min</p>;
}
