from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))             
    description = Column(String(1024))      
    status = Column(String(50))            
    due_date = Column(Date)
    priority = Column(String(50))          
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="tasks")


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    email = Column(String(255))
    password = Column(String(255))          
    role = Column(String(50))             
    tasks = relationship('Task', back_populates="user")
