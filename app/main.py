from datetime import date

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Recovery Coach")

class WorkoutIn(BaseModel):
    workout_date: date
    type: str = Field(min_length=1, max_length=50)
    duration_min: int = Field(gt=0, le=600)
    rpe: int = Field(ge=1, le=10)

class Workout(WorkoutIn):
    id: int

workouts: list[Workout] = []

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/workouts", response_model=Workout, status_code=201)
def create_workout(data: WorkoutIn):
    workout = Workout(id=len(workouts) + 1, **data.model_dump())
    workouts.append(workout)
    return workout

@app.get("/workouts", response_model=list[Workout])
def list_workouts():
    return workouts

class SleepIn(BaseModel):
    sleep_date: date
    hours: float = Field(ge=0, le=24)
    quality: int = Field(ge=1, le=5)

class Sleep(SleepIn):
    id: int

sleeps: list[Sleep] = []

@app.post("/sleeps", response_model=Sleep, status_code = 201)
def create_sleep(data: SleepIn):
    sleep = Sleep(id = len(sleeps) + 1, **data.model_dump())
    sleeps.append(sleep)
    return sleep

@app.get("/sleeps", response_model = list[Sleep])
def list_sleeps():
    return sleeps





