import React, { useEffect, useState } from 'react';
import Searchbar from './Searchbar/Searchbar';
import { getPhotos } from './service/image-service';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';

import styles from './App.module.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [hasMoreImages, setHasMoreImages] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const { hits, totalHits } = await getPhotos({ q: searchQuery, page });
          setImages(prevImages => [...prevImages, ...hits]);
          setHasMoreImages(Math.ceil(totalHits / 12) > page);
        } catch (error) {
          console.error('Error fetching photos:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [searchQuery, page]);

  const handleSearchSubmit = newSearchQuery => {
    setSearchQuery(newSearchQuery);
    setPage(1);
    setImages([]);
  };

  const handleLoadMoreClick = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = largeImageUrl => {
    setShowModal(true);
    setLargeImageURL(largeImageUrl);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.App}>
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {isLoading && <Loader />}
      {hasMoreImages && <Button onClick={handleLoadMoreClick} />}
      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
