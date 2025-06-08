from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, models, database, oauth2

router = APIRouter(prefix="/task", tags=["Tasks"])
get_db = database.get_db

@router.post("/", response_model=schemas.ShowTask)
def create_task(request: schemas.TaskCreate, db: Session = Depends(get_db)):
    new_task = models.Task(**request.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/", response_model=list[schemas.ShowTask])
def get_all_tasks(db: Session = Depends(get_db), current_user:schemas.UserBase = Depends(oauth2.get_current_user)):
    return db.query(models.Task).all()

@router.get("/{id}", response_model=schemas.ShowTask)
def get_task(id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{id}", response_model=schemas.ShowTask)
def update_task(id: int, request: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for field, value in request.dict(exclude_unset=True).items():
        setattr(task, field, value)
    
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{id}")
def delete_task(id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted"}
