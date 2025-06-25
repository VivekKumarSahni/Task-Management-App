from fastapi import APIRouter, Depends, HTTPException
from .. import schemas, models, database, token
from sqlalchemy.orm import Session
from datetime import datetime, timezone


router = APIRouter(prefix="", tags=["Auth"])
get_db = database.get_db


# @router.get("/audit-logs", response_model=list[schemas.AuditLog])
# def get_audit_logs(db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
#     if current_user.role != "admin":
#         raise HTTPException(status_code=403, detail="Not authorized")
#     return db.query(models.AuditLog).order_by(models.AuditLog.timestamp.desc()).all()
def log_action(db: Session, user_id: int, action: str,  task_id: int, title: str,details: str = ""):
    audit = models.AuditLog(
        user_id=user_id,
        action=action,
        task_id=task_id,
        title=title,
        timestamp=datetime.now(timezone.utc),
        details=details
    )
    db.add(audit)
    db.commit()

@router.get("/audit-logs")
def get_all_users(db: Session = Depends(get_db)):
    return db.query(models.AuditLog).order_by(models.AuditLog.timestamp.desc()).all() 