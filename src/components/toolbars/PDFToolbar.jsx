/* eslint-disable react/prop-types */
import './PDFToolbar.css';

export const PDFToolbar = ({
    printPDF,
    downloadPDF,
    prevPage,
    nextPage,
    rotateLeft,
    rotateRight,
    zoomIn,
    zoomOut,
    resetZoom,
    pageNumber,
    numPages,
    scale,
    prevMatch,
    nextMatch,
    searchInPDF,
    searchText,
    setSearchText
}) => {
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchInPDF(searchText);
        }
    }
    return (
        <div className="toolbar">
            {"|"}
            <input
                className="input-search"
                type="text"
                placeholder="Buscar Texto..."
                value={searchText}
                onChange={(e) => handleSearch(e)}
                onKeyDown={(e) => handleKeyDown(e)}
            />
            <button onClick={() => searchInPDF(searchText)}>
                <i className="fas fa-search"></i>
            </button>
            <button onClick={() => prevMatch()}>
                <i className="fa-solid fa-caret-left"></i>
            </button>
            <button onClick={() => nextMatch()}>
                <i className="fa-solid fa-caret-right"></i>
            </button>
            {"|"}
            <button onClick={() => rotateLeft()} title="Rotar a la Izquierda">
                <i className="fas fa-undo"></i>
            </button>
            <button onClick={() => rotateRight()} title="Rotar a la Derecha">
                <i className="fas fa-redo"></i>
            </button>
            {"|"}
            <button onClick={() => prevPage()} disabled={pageNumber <= 1} title="Anterior">
                <i className="fas fa-arrow-left"></i>
            </button>
            <span>{pageNumber} de {numPages}</span>
            <button onClick={() => nextPage()} disabled={pageNumber >= numPages} title="Siguiente">
                <i className="fas fa-arrow-right"></i>
            </button>
            {"|"}
            <button onClick={() => zoomOut()} title="Alejar Zoom">
                <i className="fas fa-search-minus"></i>
            </button>
            <span>{Math.floor(scale * 100)}%</span>
            <button onClick={() => zoomIn()} title="Acercar Zoom">
                <i className="fas fa-search-plus"></i>
            </button>
            <button onClick={() => resetZoom()} title="Resetear Zoom">
                <i className="fa-solid fa-arrow-rotate-left"></i>
            </button>
            {"|"}
            <div className="toolbar-section">
                <button onClick={() => printPDF()} title="Imprimir">
                    <i className="fas fa-print"></i>
                </button>
                <button onClick={() => downloadPDF()} title="Descargar PDF">
                    <i className="fas fa-download"></i>
                </button>
            </div>
        </div>
    );
};