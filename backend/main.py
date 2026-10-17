from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from routers import youtube

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 ToolFlux API starting up...")
    yield
    print("🛑 ToolFlux API shutting down...")


app = FastAPI(
    title="ToolFlux API",
    description="Backend API for ToolFlux — a collection of powerful web utilities.",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+",  # any localhost port for dev
    allow_origins=["https://toolflux.io"],        # production domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(youtube.router, prefix="/api/youtube", tags=["YouTube"])


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "service": "ToolFlux API", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
