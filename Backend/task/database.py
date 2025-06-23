from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# SQLALCHAMY_DATABASE_URL = 'sqlite:///./task.db'
SQLALCHAMY_DATABASE_URL = 'mysql+pymysql://root:Y1012Jqkhkp@localhost:3306/taskdb'

# engine = create_engine(SQLALCHAMY_DATABASE_URL, connect_args={
#                        "check_same_thread": False})
engine = create_engine(SQLALCHAMY_DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False,)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()