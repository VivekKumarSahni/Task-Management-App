from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, models, database, token
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated



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
def login_user(request: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    print(request.username,request.password)

    user = db.query(models.User).filter(models.User.email == request.username).first()
    print(user.email)
    if not user :
        raise HTTPException(status_code=404,
                            detail=f"Invalid Credentials" )
    if not pwd_context.verify(request.password, user.password):
        raise HTTPException(status_code=404,
                            detail=f"Invalid Credentials" )
    
    #access_token_expires = timedelta(minutes=token.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = token.create_access_token(
        data={"sub": user.email})
    print("hello",access_token)
    return schemas.Token(access_token=access_token, token_type="bearer")

