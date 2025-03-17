import multer from "multer";

const photosupload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 10 * 1024 * 1024, // 5MB limit
		files: 1,
	},
	fileFilter: (_, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image files are allowed"));
		}
	},
});

export const validateEquipmentPhoto = photosupload.single("photo");
