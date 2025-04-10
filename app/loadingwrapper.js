// components/LoadingWrapper.jsx
"use client";
import { useState, useEffect } from 'react';
import Loader from './loading/page.js';
import styles from './loading/loading.module.css';


export const LoadingWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Loader onLoadingComplete={() => setIsLoading(false)} />}
      <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </>
  );
};