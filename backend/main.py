from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import analyze
from .core.config import settings

app = FastAPI(
    title="undecided app name",
    description="undecided app description",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# uncomment when we eventually edit this routergg
app.include_router(analyze.router, prefix=settings.API_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
