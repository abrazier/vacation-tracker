from sqlalchemy import Column, Integer, Numeric, Date, Boolean, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from datetime import date
from typing import List

Base = declarative_base()


# SQLAlchemy Models
class VacationTotalDB(Base):
    __tablename__ = "vacation_total"

    id = Column(Integer, primary_key=True)
    total_hours = Column(Numeric(6, 2), nullable=False)
    year = Column(
        Integer, nullable=False, default=func.extract("year", func.current_date())
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class VacationDayDB(Base):
    __tablename__ = "vacation_days"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    hours = Column(Numeric(4, 2), nullable=False)
    confirmed = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


# Pydantic Models
class VacationDay(BaseModel):
    date: date
    hours: float
    confirmed: bool


class VacationDayUpdate(BaseModel):
    confirmed: bool


class VacationTotal(BaseModel):
    total_hours: float


class VacationResponse(BaseModel):
    total_hours: float
    vacation_days: List[VacationDay]
