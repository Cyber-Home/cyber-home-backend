import multer from "multer";
import { multerSaveFilesOrg } from "multer-savefilesorg";


// saving files remotely
export const remoteUpload = multer ({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        limits: {fileSize: 9000000}, //limit file size to 9mb
        relativePath: '/dailySpot-api/uploads/*'
    }),
    preservePath: true
});