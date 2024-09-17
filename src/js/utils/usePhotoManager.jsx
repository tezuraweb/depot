import { useCallback } from 'react';
import axios from 'axios';

const usePhotoManager = () => {
    const uploadPhoto = useCallback(async (file, id) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', id);

        try {
            const response = await axios.post('/api/photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.fileUrl;
        } catch (error) {
            if (error.response) {
                const serverMessage = error.response.data.message;
                const errorCode = error.response.data.code;

                switch (errorCode) {
                    case 'FILE_SIZE_LIMIT':
                        throw new Error('Файл превышает максимальный размер 10 МБ');
                    case 'MULTER_ERROR':
                        throw new Error('Ошибка при загрузке файла');
                    case 'NO_FILES':
                        throw new Error('Файлы не найдены');
                    case 'FILE_TOO_SMALL':
                        throw new Error('Один из файлов слишком маленький. Минимальные размеры: 550x310');
                    case 'UPLOAD_ERROR':
                        throw new Error('Ошибка при загрузке фотографий');
                    default:
                        throw new Error('Неизвестная ошибка');
                }
            } else if (error.request) {
                throw new Error('Сервер не отвечает. Попробуйте позже.');
            } else {
                throw new Error('Ошибка при настройке запроса');
            }
        }
    }, []);

    return { uploadPhoto };
};

export default usePhotoManager;
