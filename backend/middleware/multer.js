import multer from 'multer'

const storage = multer.memoryStorage();

//Single Upload

export const singleUpload = multer({storage}).single('file')

//multiple image upload upto 5
export const multipleUpload = multer({storage}).array('files',5)