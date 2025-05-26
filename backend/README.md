# Readable Research Backend

This is the backend API for the Readable Research project, built with FastAPI.

## Setup

1. Create a Conda environment:

```bash
conda create -n readable-research python=3.11
conda activate readable-research
```

2. Install required packages:

```bash
conda install -c conda-forge fastapi uvicorn pydantic
```

Alternatively, if you have the `environment.yml` file:

```bash
conda env create -f environment.yml
conda activate readable-research
```

## Running the Server

Start the development server:

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --port 8001
```

The API will be available at http://localhost:8001

## API Documentation

Once the server is running, you can access:

- Interactive API docs (Swagger UI): http://localhost:8001/docs
- Alternative API docs (ReDoc): http://localhost:8001/redoc

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint
- `GET /api/papers/{paper_id}` - Get paper details by ID

## Project Structure

```
backend/
├── main.py           # FastAPI application
├── papers/           # Directory containing paper JSON files
└── environment.yml   # Conda environment file
```

## Adding Paper Data

To add a new paper, create a JSON file in the `papers` directory with the filename matching the paper ID (e.g., `123.json` for a paper with ID "123"). The JSON file should follow this structure:

```json
{
	"paper_id": "123",
	"title": "Paper Title",
	"authors": ["Author 1", "Author 2"],
	"abstract": "Paper abstract...",
	"publication_year": 2024,
	"keywords": ["keyword1", "keyword2"],
	"citations_count": 0,
	"pdf_url": "https://example.com/papers/123.pdf"
}
```
