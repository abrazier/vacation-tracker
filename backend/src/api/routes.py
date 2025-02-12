from fastapi import APIRouter, HTTPException
from .models import VacationDay, VacationTotal, VacationResponse
from typing import List

router = APIRouter()

# In-memory storage (replace with database in production)
vacation_data = {"total_hours": 0, "vacation_days": []}


@router.post("/total")
async def set_total_hours(data: VacationTotal):
    vacation_data["total_hours"] = data.total_hours
    return {"message": "Total hours updated successfully"}


@router.post("/days")
async def add_vacation_day(day: VacationDay):
    vacation_data["vacation_days"].append(day)
    return {"message": "Vacation day added successfully"}


@router.get("/data", response_model=VacationResponse)
async def get_vacation_data():
    return vacation_data
