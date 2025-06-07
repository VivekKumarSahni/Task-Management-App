from fastapi import FastAPI
from . import models
from .database import engine
from .routers import  task  # Add task import

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


app.include_router(task.router)  # Include task router
