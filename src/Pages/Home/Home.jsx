import React, { useState } from 'react'
import './Home.css'

const Home = () => {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("")
  const [showToast, setShowToast] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files.length > 5) {
      setError("Solo podés seleccionar hasta 5 archivos")
      e.target.value = ""
    } else {
      setError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.detail)
        setSuccess("")

        setToastMessage("Formato verificado con IA")
        setToastType("error")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } else {
        setSuccess(`✅ Archivos subidos correctamente`)
        setError("")

        setToastMessage("Formato verificado con IA")
        setToastType("success")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (err) {
      setError("❌ Error al subir los archivos")
      setSuccess("")

      setToastMessage("❌ Error al subir los archivos")
      setToastType("error")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  return (
    <main>
      <h1>Subir documentos</h1>
      <span>Cargá hasta 4 archivos del mismo formato</span>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input 
          type="file" 
          name="archivos" 
          multiple 
          onChange={handleFileChange}
        />
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Enviar</button>
      </form>

      {showToast && (
        <div className={`toast ${toastType}`}>
          {toastMessage}
        </div>
      )}
    </main>
  )
}

export default Home
