from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Question

# 라우터 파일에 반드시 필요한 것은 APIRouter 클래스로 생성한 router 객체이다. 
# 라우팅이란 FastAPI가 요청받은 URL을 해석하여 그에 맞는 함수를 실행하여 그 결과를 리턴하는 행위를 말한다.
# router 객체를 생성하여 FastAPI 앱에 등록해야만 라우팅 기능이 동작한다.
router = APIRouter(
    prefix="/api/question",
)


@router.get("/list")
def question_list(db: Session = Depends(get_db)):
    _question_list = db.query(Question).order_by(Question.create_date.desc()).all()
    return _question_list