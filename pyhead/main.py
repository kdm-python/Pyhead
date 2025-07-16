from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pyhead.api.routers import medications, diary

app = FastAPI(
    title="PyHead API",
    description="API for PyHead, a personal headache management application",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(medications.router)
app.include_router(diary.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "PyHead API is running."}
