from contextlib import asynccontextmanager
from datetime import date
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException
from sqlmodel import Field, Session, SQLModel, select
from app.db import create_db_and_tables, get_session


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(title="Recovery Coach", lifespan=lifespan)

SessionDep = Annotated[Session, Depends(get_session)]


@app.get("/health")
def health():
    return {"status": "ok"}


class WorkoutIn(SQLModel):
    workout_date: date
    type: str = Field(min_length=1, max_length=50)
    duration_min: int = Field(gt=0, le=600)
    rpe: int = Field(ge=1, le=10)


class Workout(WorkoutIn, table=True):
    id: int | None = Field(default=None, primary_key=True)


class WorkoutUpdate(SQLModel):
    workout_date: date | None = None
    type: str | None = Field(default=None, min_length=1, max_length=50)
    duration_min: int | None = Field(default=None, gt=0, le=600)
    rpe: int | None = Field(default=None, ge=1, le=10)


@app.post("/workouts", response_model=Workout, status_code=201)
def create_workout(data: WorkoutIn, session: SessionDep):
    workout = Workout.model_validate(data)
    session.add(workout)
    session.commit()
    session.refresh(workout)
    return workout


@app.get("/workouts", response_model=list[Workout])
def list_workouts(session: SessionDep):
    return session.exec(select(Workout)).all()


@app.get("/workouts/{workout_id}", response_model=Workout)
def get_workout(workout_id: int, session: SessionDep):
    workout = session.get(Workout, workout_id)
    if workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout


@app.patch("/workouts/{workout_id}", response_model=Workout)
def update_workout(workout_id: int, data: WorkoutUpdate, session: SessionDep):
    workout = get_workout(workout_id, session)
    updates = data.model_dump(exclude_unset=True, exclude_none=True)
    workout.sqlmodel_update(updates)
    session.add(workout)
    session.commit()
    session.refresh(workout)
    return workout


class SleepIn(SQLModel):
    sleep_date: date
    hours: float = Field(ge=0, le=24)
    quality: int = Field(ge=1, le=5)


class Sleep(SleepIn, table=True):
    id: int | None = Field(default=None, primary_key=True)


@app.post("/sleeps", response_model=Sleep, status_code=201)
def create_sleep(data: SleepIn, session: SessionDep):
    sleep = Sleep.model_validate(data)
    session.add(sleep)
    session.commit()
    session.refresh(sleep)
    return sleep


@app.get("/sleeps", response_model=list[Sleep])
def list_sleeps(session: SessionDep):
    return session.exec(select(Sleep)).all()
