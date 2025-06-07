from sqlalchemy import Column, Integer, String, Date
from .database import Base

# Existing models...

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    status = Column(String)
    due_date = Column(Date)
    priority = Column(String)
