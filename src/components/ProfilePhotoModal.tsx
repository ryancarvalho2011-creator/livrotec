import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Trash2, 
  Check, 
  Upload, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { UserSession } from '../types';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onUpdateAvatar: (avatarUrl: string | undefined) => void;
  isDarkMode?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateAvatar,
  isDarkMode = false
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !currentUser) return null;

  const currentAvatar = previewUrl || currentUser.avatarUrl;

  const handleFileValidationAndProcess = (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Validate file format / MIME type
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage('Formato não suportado. Por favor, envie uma imagem nos formatos JPG, JPEG, PNG ou WEBP.');
      return;
    }

    // 2. Validate file size (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('O arquivo é muito grande. O tamanho máximo permitido para a foto de perfil é de 5MB.');
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) {
        setErrorMessage('Falha ao ler o arquivo selecionado.');
        setIsProcessing(false);
        return;
      }

      // 3. Genuine image decoding validation via Image()
      const img = new Image();
      img.onload = () => {
        try {
          // 4. Client-side sanitization & rasterization to clean high-resolution square (360x360)
          const targetSize = 360;
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            setPreviewUrl(result);
            setIsProcessing(false);
            return;
          }

          // Center-crop calculation (aspect fill)
          const minSide = Math.min(img.width, img.height);
          const startX = (img.width - minSide) / 2;
          const startY = (img.height - minSide) / 2;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, targetSize, targetSize);

          // Export sanitized data URL
          let optimizedDataUrl: string;
          try {
            optimizedDataUrl = canvas.toDataURL('image/webp', 0.88);
          } catch {
            optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          }

          setPreviewUrl(optimizedDataUrl);
          setIsProcessing(false);
        } catch (e) {
          console.error('Error optimizing image', e);
          setPreviewUrl(result);
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        setErrorMessage('O arquivo enviado não é uma imagem válida ou está corrompido.');
        setIsProcessing(false);
      };

      img.src = result;
    };

    reader.onerror = () => {
      setErrorMessage('Não foi possível ler o arquivo selecionado.');
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileValidationAndProcess(file);
    }
    // reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileValidationAndProcess(file);
    }
  };

  const handleSavePhoto = () => {
    if (!previewUrl) return;
    onUpdateAvatar(previewUrl);
    setSuccessMessage('Foto de perfil salva com sucesso!');
    setTimeout(() => {
      setSuccessMessage(null);
      setPreviewUrl(null);
      onClose();
    }, 1200);
  };

  const handleCancelPreview = () => {
    setPreviewUrl(null);
    setErrorMessage(null);
  };

  const handleRemovePhoto = () => {
    onUpdateAvatar(undefined);
    setPreviewUrl(null);
    setSuccessMessage('Foto removida. O avatar padrão foi restaurado.');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1200);
  };

  const handleModalClose = () => {
    setPreviewUrl(null);
    setErrorMessage(null);
    setSuccessMessage(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1c1c]/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={handleModalClose}
    >
      <div 
        className={`relative w-full max-w-md border rounded-3xl shadow-2xl overflow-hidden my-8 transition-colors ${
          isDarkMode ? 'bg-[#111a2e] border-slate-700 text-white' : 'bg-[#fcfbfa] border-[#1c1c1c]/20 text-[#1c1c1c]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-[#0c1322] border-slate-800' : 'bg-[#ede8df] border-[#1c1c1c]/15'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border text-white shadow-xs ${
              currentUser.role === 'admin' 
                ? 'bg-rose-600 border-rose-500' 
                : 'bg-emerald-700 border-emerald-600'
            }`}>
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-delicate leading-tight">
                Foto de Perfil
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-[#5c5549]'}`}>
                Personalize sua identidade visual na Livrotec
              </p>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer border ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                : 'bg-white hover:bg-slate-100 text-[#1c1c1c] border-[#1c1c1c]/15'
            }`}
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* Notification feedback banners */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* User Profile Card Preview */}
          <div className="flex flex-col items-center justify-center text-center">
            
            {/* Circular Avatar Container with modern ring and badge */}
            <div className="relative group/photo mb-3">
              <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 shadow-xl flex items-center justify-center transition-all ${
                previewUrl 
                  ? 'border-amber-400 ring-4 ring-amber-400/20' 
                  : isDarkMode
                  ? 'border-slate-700 ring-4 ring-slate-800'
                  : 'border-[#1c1c1c]/20 ring-4 ring-black/5'
              }`}>
                {currentAvatar ? (
                  <img 
                    src={currentAvatar} 
                    alt={currentUser.name} 
                    className="w-full h-full object-cover select-none"
                  />
                ) : (
                  <div className={`w-full h-full flex flex-col items-center justify-center ${
                    currentUser.role === 'admin'
                      ? 'bg-gradient-to-br from-rose-700 to-rose-900 text-amber-200'
                      : 'bg-gradient-to-br from-emerald-700 to-teal-900 text-white'
                  }`}>
                    {currentUser.role === 'admin' ? (
                      <ShieldCheck className="w-12 h-12 text-amber-300 drop-shadow-sm" />
                    ) : (
                      <span className="text-4xl font-extrabold font-delicate tracking-wider">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                )}

                {/* Processing overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
                    <RefreshCw className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Edit button over avatar */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg border-2 border-white dark:border-slate-900 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                title="Escolher imagem da galeria ou arquivos"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Name & Details */}
            <h4 className="text-lg font-bold font-delicate leading-tight">
              {currentUser.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                currentUser.role === 'admin' 
                  ? 'bg-amber-400 text-slate-950' 
                  : isDarkMode
                  ? 'bg-slate-800 text-emerald-300 border border-slate-700'
                  : 'bg-[#ede8df] text-[#0f4d36] font-bold border border-[#1c1c1c]/15'
              }`}>
                {currentUser.role === 'admin' ? 'Administrador' : 'Estudante Leitor'}
              </span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-[#5c5549]'}`}>
                {currentUser.role === 'admin' ? 'CETI Gestão' : currentUser.studentClass || 'CETI Gov. Alberto Tavares Silva'}
              </span>
            </div>

            {previewUrl && (
              <span className="mt-2 text-xs font-semibold text-amber-500 animate-pulse">
                Prévia da nova foto selecionada
              </span>
            )}
          </div>

          {/* Drag & Drop File Upload Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
                : isDarkMode
                ? 'border-slate-700 hover:border-slate-500 bg-slate-800/40 hover:bg-slate-800/70'
                : 'border-[#1c1c1c]/25 hover:border-[#1c1c1c]/50 bg-[#faf8f5] hover:bg-[#ede8df]/60'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className={`p-3 rounded-2xl ${
                isDarkMode ? 'bg-slate-700 text-amber-300' : 'bg-[#ede8df] text-[#1c1c1c]'
              }`}>
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">
                  Clique ou arraste uma imagem aqui
                </p>
                <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-[#736b5e]'}`}>
                  Galeria do celular ou arquivos (JPG, PNG, WEBP até 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons: Save Preview OR Change / Remove */}
          {previewUrl ? (
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancelPreview}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                    : 'bg-[#ede8df] hover:bg-[#e4ddcf] text-[#1c1c1c] border-[#1c1c1c]/20'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Foto</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-1.5 ${
                  isDarkMode 
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-400 font-black' 
                    : 'bg-[#1c1c1c] hover:bg-[#2e2b26] text-[#f7f5f0] border-[#1c1c1c]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{currentUser.avatarUrl ? 'Trocar Imagem' : 'Escolher Imagem'}</span>
              </button>

              {currentUser.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className={`w-full sm:w-auto py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-1.5 ${
                    isDarkMode 
                      ? 'bg-rose-950/50 hover:bg-rose-900 text-rose-300 border-rose-800' 
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                  }`}
                  title="Remover foto e restaurar avatar padrão"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Remover Foto</span>
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
