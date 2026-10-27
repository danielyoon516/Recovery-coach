from contextlib import asynccontextmanager
from datetime import date
from typing import Annotated

from fastapi import Depends, FastAPI
from sqlmodel import Field, Session, SQLModel, select
from app.db import create_db_and_tables, get_session


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(title="Recovery Coach", lifespan=lifespan)

SessionDep = Annotated[Session, Depends(get_session)]


class WorkoutIn(SQLModel):
    workout_date: date
    type: str = Field(min_length=1, max_length=50)
    duration_min: int = Field(gt=0, le=600)
    rpe: int = Field(ge=1, le=10)


class Workout(WorkoutIn, table=True):
    id: int | None = Field(default=None, primary_key=True)


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
