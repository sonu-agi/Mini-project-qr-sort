import React, { useState, useRef } from 'react';
import { QrCode, X, ScanLine, Download, Upload, Copy, LoaderCircle, AlertTriangle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const FloatingQrTools: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate');
    
    // State for QR Generation
    const [qrValue, setQrValue] = useState('https://www.jeppiaarinstitute.org/');
    const [generateCopySuccess, setGenerateCopySuccess] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);
    
    // State for QR Scanning
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanCopySuccess, setScanCopySuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownload = () => {
        if (qrRef.current) {
            const svgElement = qrRef.current.querySelector('svg');
            if (svgElement) {
                const svgData = new XMLSerializer().serializeToString(svgElement);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.onload = () => {
                    canvas.width = 256; // Upscale for better quality
                    canvas.height = 256;
                    ctx?.drawImage(img, 0, 0, 256, 256);
                    const pngFile = canvas.toDataURL('image/png');
                    const downloadLink = document.createElement('a');
                    downloadLink.download = 'qrcode.png';
                    downloadLink.href = pngFile;
                    downloadLink.click();
                };
                img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
            }
        }
    };

    const handleCopy = (text: string, setSuccess: (val: boolean) => void) => {
        navigator.clipboard.writeText(text).then(() => {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        });
    };
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        setScanResult(null);
        setScanError(null);

        if (!('BarcodeDetector' in window)) {
            setScanError('QR code scanning is not supported by your browser.');
            setIsScanning(false);
            return;
        }

        try {
            // @ts-ignore - BarcodeDetector is not in all TS libs yet
            const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
            const imageBitmap = await createImageBitmap(file);
            const barcodes = await barcodeDetector.detect(imageBitmap);

            if (barcodes.length > 0) {
                setScanResult(barcodes[0].rawValue);
            } else {
                setScanError('No QR code could be found in the uploaded image.');
            }
        } catch (error) {
            console.error(error);
            setScanError('An error occurred while trying to scan the image.');
        } finally {
            setIsScanning(false);
            // Reset file input to allow uploading the same file again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setScanError(null);
    };
    
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 left-6 bg-[#192F59] text-white p-4 rounded-full shadow-lg hover:bg-[#101f3c] focus:outline-none focus:ring-2 focus:ring-[#192F59] focus:ring-offset-2 transition-transform duration-200 hover:scale-110 z-50"
                aria-label={isOpen ? 'Close QR Tools' : 'Open QR Tools'}
            >
                {isOpen ? <X size={24} /> : <QrCode size={24} />}
            </button>
            {isOpen && (
                <div className="fixed bottom-20 left-6 w-full max-w-xs bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 z-50 transition-all duration-300 ease-in-out transform origin-bottom-left">
                    <header className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-xl">
                        <h3 className="text-base font-bold text-gray-800">QR Toolkit</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">
                            <X size={20} />
                        </button>
                    </header>
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex" aria-label="Tabs">
                          <button
                            onClick={() => setActiveTab('generate')}
                            className={`${activeTab === 'generate' ? 'border-[#192F59] text-[#192F59]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} w-1/2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none flex items-center justify-center gap-2`}
                          >
                            <QrCode size={16} /> Generate
                          </button>
                          <button
                             onClick={() => setActiveTab('scan')}
                             className={`${activeTab === 'scan' ? 'border-[#192F59] text-[#192F59]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} w-1/2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none flex items-center justify-center gap-2`}
                          >
                             <ScanLine size={16} /> Scan
                          </button>
                      </nav>
                    </div>
                    <main className="p-4">
                        {activeTab === 'generate' && (
                            <div className="space-y-4 text-center">
                                <label htmlFor="qr-input" className="block text-sm font-medium text-gray-700 text-left">
                                  Enter text or URL
                                </label>
                                <textarea
                                  id="qr-input"
                                  value={qrValue}
                                  onChange={(e) => setQrValue(e.target.value)}
                                  rows={3}
                                  className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-[#192F59] focus:border-[#192F59]"
                                />
                                {qrValue && (
                                    <div ref={qrRef} className="p-3 bg-white border rounded-lg inline-block">
                                        <QRCodeSVG value={qrValue} size={180} />
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-2">
                                     <button
                                        onClick={() => handleCopy(qrValue, setGenerateCopySuccess)}
                                        disabled={!qrValue}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-[#192F59] bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#192F59] focus:ring-offset-2 transition-all disabled:opacity-50"
                                    >
                                        <Copy size={16} /> {generateCopySuccess ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        disabled={!qrValue}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#192F59] rounded-lg shadow-sm hover:bg-[#101f3c] focus:outline-none focus:ring-2 focus:ring-[#192F59] focus:ring-offset-2 transition-all disabled:bg-gray-400"
                                    >
                                        <Download size={16} /> Download
                                    </button>
                                </div>
                            </div>
                        )}
                        {activeTab === 'scan' && (
                            <div className="space-y-4">
                                {isScanning && (
                                    <div className="text-center space-y-4 p-4 bg-gray-50 rounded-lg flex flex-col items-center">
                                        <LoaderCircle size={32} className="mx-auto text-gray-400 animate-spin" />
                                        <h4 className="text-base font-semibold text-gray-700">Scanning...</h4>
                                        <p className="text-xs text-gray-500">Analyzing the image for a QR code.</p>
                                    </div>
                                )}
                                {scanError && !isScanning && (
                                     <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center space-y-2">
                                         <AlertTriangle size={24} className="mx-auto text-red-500" />
                                         <h4 className="font-semibold text-red-800">Scan Failed</h4>
                                         <p className="text-xs text-red-700">{scanError}</p>
                                         <button onClick={resetScanner} className="mt-2 text-sm font-medium text-[#192F59] hover:underline">Try Again</button>
                                     </div>
                                )}
                                {scanResult && !isScanning && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-800">Scan Result:</h4>
                                        <textarea readOnly value={scanResult} rows={4} className="w-full text-sm bg-gray-50 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#192F59]"></textarea>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={() => handleCopy(scanResult, setScanCopySuccess)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-[#192F59] bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200">
                                                <Copy size={16} /> {scanCopySuccess ? 'Copied!' : 'Copy'}
                                            </button>
                                            <button onClick={resetScanner} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#192F59] rounded-lg shadow-sm hover:bg-[#101f3c]">
                                                <ScanLine size={16} /> Scan New
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {!isScanning && !scanResult && !scanError && (
                                     <div className="text-center space-y-4 p-4 bg-gray-50 rounded-lg">
                                         <ScanLine size={32} className="mx-auto text-gray-400" />
                                         <h4 className="text-base font-semibold text-gray-700">Scan QR Code</h4>
                                         <p className="text-xs text-gray-500">
                                           Upload an image file to detect and read a QR code.
                                         </p>
                                         <label
                                            htmlFor="qr-file-upload"
                                            className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#192F59] rounded-lg shadow-sm hover:bg-[#101f3c] focus:outline-none focus:ring-2 focus:ring-[#192F59] focus:ring-offset-2 transition-all"
                                         >
                                            <Upload size={16} /> Upload Image
                                         </label>
                                         <input ref={fileInputRef} id="qr-file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            )}
        </>
    );
};

export default FloatingQrTools;
