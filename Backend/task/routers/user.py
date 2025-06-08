from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, models, database
from passlib.context import CryptContext

router = APIRouter(prefix="", tags=["Auth"])
get_db = database.get_db
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register", response_model=schemas.ShowUser)
def create_user(request: schemas.UserBase, db: Session = Depends(get_db)):
    request.password = pwd_context.hash(request.password)
    new_user = models.User(**request.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def create_user(request: schemas.LoginUser, db: Session = Depends(get_db)):
    print(request)

    user = db.query(models.User).filter(models.User.email == request.username).first()
    print(user)
    if not user :
        raise HTTPException(status_code=404,
                            detail=f"Invalid Credentials" )
    if not pwd_context.verify(request.password, user.password):
        raise HTTPException(status_code=404,
                            detail=f"Invalid Credentials" )
    return user