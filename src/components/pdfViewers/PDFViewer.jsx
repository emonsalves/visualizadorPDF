/* eslint-disable react/prop-types */
import { useState, useMemo, useRef, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { PDFToolbar } from '../toolbars/PDFtoolbar';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';   
import './PDFViewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export const PDFViewer = ({ base64PDF }) => {
    const [folio, setFolio] = useState(929316);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const pdfDocumentRef = useRef(null);
    const printContainerRef = useRef(null);
    const mainContentRef = useRef(null);

    useEffect(() => {
        const loadPdf = async () => {
            try {
                const loadingTask = pdfjs.getDocument({ data: atob(base64PDF) });
                pdfDocumentRef.current = await loadingTask.promise;
            } catch (error) {
                console.error('Error loading PDF:', error);
            }
            setFolio(929316);
        };

        loadPdf();
    }, [base64PDF]);

    const downloadPDF = () => {
        const linkSource = `data:application/pdf;base64,${base64PDF}`;
        const downloadLink = document.createElement('a');
        const fileName = 'document.pdf';

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    };

    const printPDF = async () => {
        if (!pdfDocumentRef.current || !numPages) {
            console.error('PDF document not loaded');
            return;
        }

        const pdfDocument = pdfDocumentRef.current;
        const printContainer = printContainerRef.current;
        const mainContent = mainContentRef.current;

        // Limpiar el contenedor de impresión
        printContainer.innerHTML = '';

        // Renderizar todas las páginas del PDF para impresión
        for (let i = 1; i <= numPages; i++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'print-page';
            printContainer.appendChild(pageDiv);

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // Obtener la página del PDF y renderizarla en el canvas
            const page = await pdfDocument.getPage(i);
            const viewport = page.getViewport({ scale: 2 });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: context,
                viewport: viewport,
            }).promise;

            pageDiv.appendChild(canvas);
        }

        // Ocultar la vista principal mientras se imprime
        mainContent.style.display = 'none';
        printContainer.style.display = 'block';

        // Esperar un corto periodo para asegurar que el DOM se actualice
        setTimeout(() => {
            window.print();
            mainContent.style.display = 'block';
            printContainer.style.display = 'none';
        }, 500);
    };

    const rotateLeft = () => setRotation((prevRotation) => (prevRotation - 90) % 360);

    const rotateRight = () => setRotation((prevRotation) => (prevRotation + 90) % 360);

    const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 3));

    const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));

    const resetZoom = () => setScale(1);

    const nextPage = () => setPageNumber((prevPage) => Math.min(prevPage + 1, numPages));

    const prevPage = () => setPageNumber((prevPage) => Math.max(prevPage - 1, 1));

    const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

    const highlightSearch = (matches) => {
        const pdfDocument = pdfDocumentRef.current;
    
        matches.forEach(async (match) => {
            const page = await pdfDocument.getPage(match.page);
            const textContent = await page.getTextContent();
    
            const textLayer = document.querySelector(`.react-pdf__Page[data-page-number="${match.page}"] .react-pdf__Page__textLayer`);
            if (textLayer) {
                const textItems = textContent.items;
                let currentIndex = 0;
    
                textItems.forEach((item) => {
                    const textDiv = textLayer.children[currentIndex];
                    if (textDiv && item.str.includes(match.matchText)) {
                        const regex = new RegExp(`(${match.matchText})`, 'gi');
                        textDiv.innerHTML = textDiv.innerHTML.replace(regex, '<span class="highlight">$1</span>');
                    }
                    currentIndex++;
                });
            }
        });
    };
    
    const searchInPDF = async (searchText) => {
        const pdfDocument = pdfDocumentRef.current;
    
        if (!pdfDocument) {
            console.error('PDF document not loaded');
            return;
        }
    
        const matches = [];
    
        for (let pageIndex = 1; pageIndex <= numPages; pageIndex++) {
            const page = await pdfDocument.getPage(pageIndex);
            const textContent = await page.getTextContent();
    
            const pageText = textContent.items.map(({ str }) => str).join(' ');
    
            const regex = new RegExp(searchText, 'gi');
            const pageMatches = [...pageText.matchAll(regex)];
    
            pageMatches.forEach((match) => {
                matches.push({
                    page: pageIndex,
                    matchIndex: match.index,
                    matchText: match[0],
                });
            });
        }
    
        setSearchResults(matches);
        setCurrentMatchIndex(0);
    
        if (matches.length > 0) {
            setPageNumber(matches[0].page);
            highlightSearch(matches);
        }
    };

    const nextMatch = () => {
        if (searchResults.length > 0) {
            const nextIndex = (currentMatchIndex + 1) % searchResults.length;
            setCurrentMatchIndex(nextIndex);
            setPageNumber(searchResults[nextIndex].page);
        }
    };

    const prevMatch = () => {
        if (searchResults.length > 0) {
            const prevIndex = (currentMatchIndex - 1 + searchResults.length) % searchResults.length;
            setCurrentMatchIndex(prevIndex);
            setPageNumber(searchResults[prevIndex].page);
        }
    };

    const options = useMemo(() => ({
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
        cMapPacked: true,
    }), []);

    return (
        <div className="pdf-container">
            <div className="pdf-navbar">
                <img src="/img/HeaderLogo.png" alt="Logo" width="300" />
                <h5>Documento Folio N°
                    <strong id="download" onClick={() => downloadPDF()}>
                        {folio}
                    </strong>
                </h5>
            </div>
            <div className="pdf-viewer">
                <div className="thumbnail-panel">
                    <Document
                        file={`data:application/pdf;base64,${base64PDF}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        options={options}
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <div
                                key={`thumb-${index + 1}`}
                                className={`thumbnail ${pageNumber === index + 1 ? 'active' : ''}`}
                                onClick={() => setPageNumber(index + 1)}
                            >
                                <Page
                                    pageNumber={index + 1}
                                    width={150}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                />
                            </div>
                        ))}
                    </Document>
                </div>
                <div className="main-content" ref={mainContentRef}> {/* Añadir referencia para ocultar la vista */}
                    <PDFToolbar
                        printPDF={printPDF}
                        downloadPDF={downloadPDF}
                        prevPage={prevPage}
                        nextPage={nextPage}
                        rotateLeft={rotateLeft}
                        rotateRight={rotateRight}
                        zoomIn={zoomIn}
                        zoomOut={zoomOut}
                        resetZoom={resetZoom}
                        pageNumber={pageNumber}
                        numPages={numPages}
                        scale={scale}
                        prevMatch={prevMatch}
                        nextMatch={nextMatch}
                        searchInPDF={searchInPDF}
                        searchText={searchText}
                        setSearchText={setSearchText}
                    />
                    <div className="pdf-rotate">
                        <div className="pdf-content">
                            <Document
                                file={`data:application/pdf;base64,${base64PDF}`}
                                onLoadSuccess={onDocumentLoadSuccess}
                                options={options}
                                loading="Cargando documento..."
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    className="pdf-page"
                                    rotate={rotation}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                />
                            </Document>
                        </div>
                    </div>
                </div>
                <div ref={printContainerRef} style={{ display: 'none' }}></div>
            </div>
        </div>
    );
};
