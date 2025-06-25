from pydantic import BaseModel,ConfigDict
from datetime import date, datetime

# Existing schemas...

class TaskBase(BaseModel):
    title: str
    description: str
    status: str
    due_date: date
    priority: str
    user_id: int | None = None


class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    due_date: date | None = None
    priority: str | None = None
    user_id: int | None = None

class ShowTask(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    status: str
    due_date: date
    priority: str
    user_id: int | None = None

    #class Config:
        #from_attributes = True

class UserBase(BaseModel):
    name: str
    email: str
    password: str
    role: str | None = None

class ShowUser(BaseModel):
    name: str
    email: str
    
class LoginUser(BaseModel):
    username: str
    password: str
    
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


class AuditLog(BaseModel):
    id: int
    action: str
    entity: str
    entity_id: int
    user_id: int | None = None
    timestamp: datetime
    details: str


