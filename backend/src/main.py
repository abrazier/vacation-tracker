from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import router  # Changed from 'api.routes' to 'src.api.routes'

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router with prefix
app.include_router(router, prefix="")
