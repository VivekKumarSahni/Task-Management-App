from fastapi import APIRouter, Depends, HTTPException,  Query
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from .. import schemas, models, database, oauth2
from .log import log_action

router = APIRouter(prefix="/task", tags=["Tasks"])
get_db = database.get_db

#, response_model=schemas.ShowTask
@router.post("/", response_model=schemas.ShowTask)
def create_task(request: schemas.TaskCreate, db: Session = Depends(get_db)):
    new_task = models.Task(**request.model_dump())

    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    log_action(db, new_task.user_id, "create",  new_task.id, new_task.title,f"Task titled '{new_task.title}' created.")
    return new_task

# after (get_db), current_user:schemas.UserBase = Depends(oauth2.get_current_user)
# , response_model=list[schemas.TaskBase]
# @router.get("/")
# def get_all_tasks(db: Session = Depends(get_db)):
#     return db.query(models.Task).all()
@router.get("/")
def get_all_tasks(
    db: Session = Depends(get_db),
    _page: int = Query(1, alias="_page"),
    _limit: int = Query(5, alias="_limit"),
    _sort: str = Query(None, alias="_sort"),
    _order: str = Query("asc", alias="_order"),
    status: str = None,
    priority: str = None,
):
    query = db.query(models.Task)

    # Filtering
    if status:
        query = query.filter(models.Task.status == status)
    if priority:
        query = query.filter(models.Task.priority == priority)

    # Total items before pagination
    total_items = query.count()

    # Sorting
    if _sort:
        sort_column = getattr(models.Task, _sort, None)
        if sort_column is not None:
            if _order == "desc":
                query = query.order_by(desc(sort_column))
            else:
                query = query.order_by(asc(sort_column))

    # Pagination
    tasks = query.offset((_page - 1) * _limit).limit(_limit).all()

    return {
        "tasks": tasks,
        "totalItems": total_items
    }

@router.get("/{id}", response_model=schemas.ShowTask)
def get_task(id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{id}")
def update_task(id: int, request: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for field, value in request.dict(exclude_unset=True).items():
        setattr(task, field, value)
    
    db.commit()
    db.refresh(task)
    log_action(db, task.user_id, "update", task.id,task.title, f"Task titled '{task.title}' updated.")
    return task

@router.delete("/{id}")
def delete_task(id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    log_action(db, task.user_id, "delete",  task.id,task.title, f"Task titled '{task.title}' deleted.")

    db.delete(task)
    db.commit()
    return {"detail": "Task deleted"}
