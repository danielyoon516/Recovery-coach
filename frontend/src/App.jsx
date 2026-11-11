import { useEffect, useState } from "react";
import { WorkoutForm, WorkoutItem, TotalDuration } from "./components/Workouts";

function App() {
  const [workouts, setWorkouts] = useState([]);

  function handleCreated(newWorkout) {
    setWorkouts([...workouts, newWorkout]);
  }

  function handleDeleted(id) {
    setWorkouts(workouts.filter((w) => w.id !== id));
  }

  function handleUpdated(updated) {
    setWorkouts(workouts.map((w) => (w.id === updated.id ? updated : w)));
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
          <WorkoutItem
            key={w.id}
            workout={w}
            onDeleted={handleDeleted}
            onUpdated={handleUpdated}
          />
        ))}
      </ul>
      <TotalDuration workouts={workouts} />
    </div>
  );
}

export default App;
