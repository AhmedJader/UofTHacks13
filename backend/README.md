Install uv here: https://docs.astral.sh/uv/getting-started/installation/

To actually choose the python interpreter, uv handles the venv itself so you have to configure the python interpreter:

1. Open command palette (ctrl shift p)
2. Search up select python interpreter
3. Select find in files
4. Go into .venv once generated and then go into scripts and pick `python.exe`
5. `main.py` should not have anymore squiggly lines

Run the app wth uv:

```bash
uv run fastapi dev main.py
```

Visit this link to view swagger:

```bash
localhost:8000/docs
```
