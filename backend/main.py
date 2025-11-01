from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import magic
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)

@app.post("/upload")
async def upload_files(archivos: List[UploadFile] = File(...)):
    if len(archivos) > 4:
        raise HTTPException(status_code=400, detail="Solo se permiten hasta 4 archivos")

    tipos_detectados = []

    for archivo in archivos:
        contenido = await archivo.read()
        tipo_real = magic.from_buffer(contenido, mime=True) 
        tipos_detectados.append(tipo_real)
        archivo.file.seek(0) 

    if len(set(tipos_detectados)) != 1:
        raise HTTPException(
            status_code=400,
            detail=f"❌ Los archivos no tienen el mismo formato"
        )

    for archivo in archivos:
        path = os.path.join("uploads", archivo.filename)
        with open(path, "wb") as f:
            f.write(await archivo.read())

    return {"message": "Archivos verificados y subidos correctamente", "formato_real": tipos_detectados[0]}