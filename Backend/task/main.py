from fastapi import FastAPI
from . import models
from .database import engine
from .routers import  task,user  # Add task import

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


app.include_router(task.router)  # Include task router
app.include_router(user.router)  # Include user router
