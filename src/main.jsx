import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider } from './contexts';
import { RouterProvider } from "react-router-dom";
import { Router } from './routes';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={Router} />
    </AppProvider>
  </StrictMode>
)