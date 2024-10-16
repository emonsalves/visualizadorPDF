import { PDFViewer } from '../components/pdfViewers/PDFViewer';
import { base64PDFv2 } from '../assets/sampleBase64v2';

export const Visualizador = () => {
    return (
        <PDFViewer base64PDF={base64PDFv2} />
    )
}