from sqlalchemy import Column, Integer, Numeric, Date, Boolean, DateTime, func, text
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from datetime import date, datetime
from typing import List

Base = declarative_base()


# SQLAlchemy Models
class VacationTotalDB(Base):
    __tablename__ = "vacation_total"

    id = Column(Integer, primary_key=True)
    total_hours = Column(Numeric(6, 2), nullable=False)
    year = Column(Integer, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
        onupdate=text("CURRENT_TIMESTAMP"),
        nullable=False,
    )


class VacationDayDB(Base):
    __tablename__ = "vacation_days"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    hours = Column(Numeric(4, 2), nullable=False)
    confirmed = Column(Boolean, nullable=False, default=False)
    created_at = Column(
        DateTime(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
        onupdate=text("CURRENT_TIMESTAMP"),
        nullable=False,
    )


# Pydantic Models for Request/Response
class VacationDayCreate(BaseModel):
    date: str
    hours: float
    confirmed: bool = False


class VacationTotal(BaseModel):
    total_hours: float


class VacationDay(BaseModel):
    id: int
    date: str
    hours: float
    confirmed: bool


class VacationDayUpdate(BaseModel):
    confirmed: bool


class VacationDayResponse(BaseModel):
    date: str
    hours: float
    confirmed: bool


class VacationResponse(BaseModel):
    total_hours: float
    vacation_days: List[VacationDay]
