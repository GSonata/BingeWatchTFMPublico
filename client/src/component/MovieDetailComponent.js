// src/component/MovieDetailComponent.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../styles/MovieDetails.scss";

import CopiesTableComponent from './CopiesTableComponent';
import UserInteractionComponent from './UserInteractionComponent';
import FooterComponent from "./Subcomponentes/FooterComponent";
import BannerComponent from "./Subcomponentes/BannerComponent";
import AddCopyModal from './Subcomponentes/Modales/AddCopyModal';
import ConfirmDeleteModal from './Subcomponentes/Modales/ConfirmDeleteModal';
import CopyImageModal from "./Subcomponentes/Modales/CopyImageModal";

const Toast = Swal.mixin({
  toast: true,
  position: 'bottom',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#2a2f36',
  color: '#ffffff',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

function MovieDetailComponent() {
  const { imdbID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [coleccion, setColeccion] = useState([]);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copyModalMode, setCopyModalMode] = useState("add");
  const [editingCopy, setEditingCopy] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copyToDeleteId, setCopyToDeleteId] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleViewImage = (base64) => {
    setSelectedImage(base64);
    setShowImageModal(true);
  };

  const baseUrl = process.env.REACT_APP_API_URL;

  const fetchMovieDetails = async () => {
    try {
      const res = await axios.get(`${baseUrl}/movies/${imdbID}`, { withCredentials: true });
      setMovie(res.data);
    } catch (err) {
      console.error('Error al obtener los detalles de la película:', err.message);
    }
  };

  const fetchColeccion = async () => {
    try {
      const res = await axios.get(`${baseUrl}/user/coleccion/${imdbID}`, { withCredentials: true });
      setColeccion(res.data);
    } catch (err) {
      console.error('Error al obtener la colección:', err.message);
    }
  };

  const handleDeleteClick = (idCopia) => {
    setCopyToDeleteId(idCopia);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    try {
      const res = await axios.delete(`${baseUrl}/user/coleccion/${copyToDeleteId}`, {
        withCredentials: true
      });

      Toast.fire({ icon: 'success', title: 'Copia eliminada correctamente' });
      fetchColeccion();

      if (res.data.nuevasInsignias?.length >= 0) {
        const idsActuales = (await axios.get(`${baseUrl}/user/badges`, {
          withCredentials: true
        })).data.map(b => b.id);

        const perdidas = res.data.perdidasInsignias?.filter(b => !idsActuales.includes(b.id)) || [];

        if (perdidas.length > 0) {
          perdidas.forEach(badge => {
            Swal.fire({
              title: `⚠️ Has perdido una insignia`,
              text: `${badge.nombre}: ${badge.descripcion}`,
              imageUrl: `/images/badges/${badge.id}.png`,
              imageHeight: 100,
              confirmButtonText: 'Vaya...'
            });
          });
        }
      }
    } catch (err) {
      Toast.fire({ icon: 'error', title: 'No se pudo eliminar la copia' });
    }
  };

  useEffect(() => {
    fetchMovieDetails();
    fetchColeccion();
  }, [imdbID]);

  const openAddCopyModal = () => {
    setEditingCopy(null);
    setCopyModalMode("add");
    setIsCopyModalOpen(true);
  };

  const handleEditCopy = (copia) => {
    setEditingCopy(copia);
    setCopyModalMode("edit");
    setIsCopyModalOpen(true);
  };

const onDeleteImage = async (idCopia) => {
  const copia = coleccion.find(c => c.idCopia === idCopia);
  if (!copia) return;

  try {
    await axios.put(`${baseUrl}/user/coleccion/${idCopia}`, {
      soporte: copia.soporte,
      estado: copia.estado,
      foto: "", 
      tags: copia.tags
    }, { withCredentials: true });

    Swal.fire("Imagen eliminada", "La imagen se ha borrado correctamente", "success");
    fetchColeccion();
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudo borrar la imagen", "error");
  }
};

  const handleConfirmCopy = async (formValues) => {
    const payload = {
      soporte: formValues.soporte,
      estado: formValues.estado,
      foto: formValues.foto ?? "",
      tags: formValues.tags ?? []
    };

    if (copyModalMode === 'add') {
      try {
        const res = await axios.post(`${baseUrl}/user/coleccion`, {
          ...payload,
          imdbID: movie.imdbID
        }, { withCredentials: true });

        Toast.fire({ icon: 'success', title: 'Copia añadida correctamente' });
        fetchColeccion();

        if (res.data.nuevasInsignias?.length > 0) {
          res.data.nuevasInsignias.forEach(badge => {
            Swal.fire({
              title: `🎉 ¡Nueva insignia desbloqueada!`,
              text: `${badge.nombre}: ${badge.descripcion}`,
              imageUrl: `/images/badges/${badge.id}.png`,
              imageHeight: 100,
              confirmButtonText: '¡Genial!'
            });
          });
        }

      } catch (err) {
        Toast.fire({ icon: 'error', title: 'No se pudo añadir la copia' });
      }

    } else if (copyModalMode === 'edit') {
      try {
        await axios.put(`${baseUrl}/user/coleccion/${editingCopy.idCopia}`, payload, {
          withCredentials: true
        });

        Toast.fire({ icon: 'success', title: 'Copia actualizada correctamente' });
        fetchColeccion();

      } catch (err) {
        Toast.fire({ icon: 'error', title: 'No se pudo actualizar la copia' });
      }
    }
  };

  const getScoreClass = (score) => {
    if (score < 30) return 'low';
    if (score < 60) return 'medium';
    return 'high';
  };

  if (!movie) return <p>Cargando película...</p>;

  return (
    <>
      <BannerComponent />
      <div className="movie-detail-container">
        <div className="movie-header">
          <div className="movie-poster-wrapper">
            {movie.poster && (
              <img src={movie.poster} alt={movie.title} className="movie-poster" />
            )}
          </div>

          <div className="movie-info">
            <h2>
              {movie.title} <span className="movie-year">({movie.year})</span>
            </h2>

            <div className="info-row">
              <p><span className="label">Duración:</span> {movie.runtime}</p>
              <div className="metascore-wrapper">
                <span className="label">Metascore:</span>
                <span className={`metascore-circle ${getScoreClass(movie.metascore)}`}>
                  {movie.metascore}
                </span>
              </div>
            </div>

            <div className="info-row">
              <p><span className="label">Género:</span> {movie.genre.join(', ')}</p>
              <p><span className="label">Director:</span> {movie.director}</p>
            </div>

            <div className="actor-section">
              <p><span className="label">Actores:</span></p>
              <div className="actor-toasts">
                {movie.actors.map((actor, index) => (
                  <span key={index} className="actor-toast">{actor}</span>
                ))}
              </div>
            </div>

            <div className="synopsis-box">
              <p><span className="label">Sinopsis:</span> {movie.plot}</p>
            </div>
          </div>

          <UserInteractionComponent imdbID={movie.imdbID} />
        </div>

        <h3 className="section-title">Tus copias: </h3>

        <button
          style={{ display: "none" }}
          data-testid="open-add-modal"
          onClick={openAddCopyModal}
        >
          Añadir copia (test)
        </button>

        <AddCopyModal
          isOpen={isCopyModalOpen}
          onClose={() => setIsCopyModalOpen(false)}
          onConfirm={handleConfirmCopy}
          mode={copyModalMode}
          copyData={editingCopy}
        />

        <CopyImageModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          imageSrc={selectedImage}
        />

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />

        <CopiesTableComponent
          copias={coleccion}
          onDeleteCopy={handleDeleteClick}
          onEditCopy={handleEditCopy}
          onViewImage={handleViewImage}
          setIsAddModalOpen={openAddCopyModal}
          onDeleteImage={onDeleteImage}
        />
      </div>
      <FooterComponent />
    </>
  );
}

export default MovieDetailComponent;
