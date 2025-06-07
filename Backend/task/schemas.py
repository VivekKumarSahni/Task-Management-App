from pydantic import BaseModel,ConfigDict
from datetime import date

# Existing schemas...

class TaskBase(BaseModel):
    title: str
    description: str
    status: str
    due_date: date
    priority: str

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    due_date: date | None = None
    priority: str | None = None

class ShowTask(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str

    #class Config:
        #from_attributes = True
