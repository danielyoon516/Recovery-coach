function WorkoutItem({ workout }) {
  return (
    <li>
      {workout.type}, {workout.duration_min} min (RPE {workout.rpe})
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
  const workouts = [
    { id: 1, type: "run", duration_min: 40, rpe: 6 },
    { id: 2, type: "lift", duration_min: 60, rpe: 8 },
    { id: 3, type: "swim", duration_min: 30, rpe: 5 },
  ];

  return (
    <div>
      <h1>Recovery Coach</h1>
      <ul>
        {workouts.map((w) => (
          <WorkoutItem key={w.id} workout={w} />
        ))}
      </ul>

      <TotalDuration workouts={workouts} />
    </div>
  );
}

export default App;
