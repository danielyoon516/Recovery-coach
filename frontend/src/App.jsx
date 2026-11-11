import { useEffect, useState } from "react";

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

function WorkoutItem({ workout, onDeleted }) {
  async function handleDelete() {
    const res = await fetch(`/api/workouts/${workout.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      onDeleted(workout.id);
    }
  }

  return (
    <li>
      {workout.type}, {workout.duration_min} min (RPE {workout.rpe})
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

function App() {
  const [workouts, setWorkouts] = useState([]);

  function handleCreated(newWorkout) {
    setWorkouts([...workouts, newWorkout]);
  }

  function handleDeleted(id) {
    setWorkouts(workouts.filter((w) => w.id !== id));
  }

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/workouts");
      const data = await res.json();
      setWorkouts(data);
    }
    load();
  }, []);

  return (
    <div>
      <h1>Recovery Coach</h1>
      <WorkoutForm onCreated={handleCreated} />
      <ul>
        {workouts.map((w) => (
          <WorkoutItem key={w.id} workout={w} onDeleted={handleDeleted} />
        ))}
      </ul>
      <TotalDuration workouts={workouts} />
    </div>
  );
}

export default App;
