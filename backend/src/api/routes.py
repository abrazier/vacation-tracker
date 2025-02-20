from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from . import models
from .database import get_db
from datetime import datetime

router = APIRouter()


@router.post("/api/total")
async def set_total_hours(data: models.VacationTotal, db: Session = Depends(get_db)):
    current_year = datetime.now().year
    total = db.query(models.VacationTotalDB).filter_by(year=current_year).first()

    if total:
        total.total_hours = data.total_hours
    else:
        total = models.VacationTotalDB(total_hours=data.total_hours, year=current_year)
        db.add(total)

    db.commit()
    return {"message": "Total hours updated successfully"}


@router.post("/api/days")
async def add_vacation_day(
    day: models.VacationDayCreate, db: Session = Depends(get_db)
):
    try:
        date_obj = datetime.strptime(day.date, "%Y-%m-%d").date()
        db_day = models.VacationDayDB(
            date=date_obj, hours=day.hours, confirmed=day.confirmed
        )
        db.add(db_day)
        db.commit()
        return {"message": "Vacation day added successfully"}
    except Exception as e:
        print(f"Error adding vacation day: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))


@router.patch("/api/days/{day_id}")
async def update_vacation_day(
    day_id: int, update: models.VacationDayUpdate, db: Session = Depends(get_db)
):
    day = db.query(models.VacationDayDB).filter_by(id=day_id).first()
    if not day:
        raise HTTPException(status_code=404, detail="Vacation day not found")

    day.confirmed = update.confirmed
    db.commit()
    return {"message": "Vacation day updated successfully"}


@router.get("/api/data", response_model=models.VacationResponse)
async def get_vacation_data(db: Session = Depends(get_db)):
    current_year = datetime.now().year
    total = db.query(models.VacationTotalDB).filter_by(year=current_year).first()
    days = db.query(models.VacationDayDB).all()

    return {
        "total_hours": float(total.total_hours) if total else 0,
        "vacation_days": [
            {
                "id": day.id,
                "date": day.date.isoformat(),
                "hours": float(day.hours),
                "confirmed": day.confirmed,
            }
            for day in days
        ],
    }


@router.delete("/api/days/{day_id}")
async def delete_vacation_day(day_id: int, db: Session = Depends(get_db)):
    day = db.query(models.VacationDayDB).filter_by(id=day_id).first()
    if not day:
        raise HTTPException(status_code=404, detail="Vacation day not found")

    db.delete(day)
    db.commit()
    return {"message": "Vacation day deleted successfully"}
