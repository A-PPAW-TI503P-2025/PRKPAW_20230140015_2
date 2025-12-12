const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");

const timeZone = "Asia/Jakarta";

/* =======================
   MULTER CONFIG
======================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
  }
};

exports.upload = multer({ storage, fileFilter });

/* =======================
   CHECK-IN
======================= */
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const { latitude, longitude } = req.body;
    const waktuSekarang = new Date();
    const buktiFoto = req.file ? req.file.path : null;

    // Rentang hari ini
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Cek apakah SUDAH check-in hari ini
    const existingPresensi = await Presensi.findOne({
      where: {
        userId,
        checkIn: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    if (existingPresensi) {
      return res.status(400).json({
        message: "Anda sudah melakukan check-in hari ini.",
      });
    }

    const newPresensi = await Presensi.create({
      userId,
      checkIn: waktuSekarang,
      latitude: latitude || null,
      longitude: longitude || null,
      buktiFoto,
    });

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: newPresensi,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal melakukan check-in",
      error: error.message,
    });
  }
};

/* =======================
   CHECK-OUT
======================= */
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Cari presensi AKTIF (belum check-out)
    const presensiAktif = await Presensi.findOne({
      where: {
        userId,
        checkOut: null,
      },
      order: [["checkIn", "DESC"]],
    });

    if (!presensiAktif) {
      return res.status(400).json({
        message: "Anda belum melakukan check-in hari ini.",
      });
    }

    presensiAktif.checkOut = waktuSekarang;
    await presensiAktif.save();

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: presensiAktif,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal melakukan check-out",
      error: error.message,
    });
  }
};

/* =======================
   DELETE PRESENSI
======================= */
exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;

    const presensi = await Presensi.findByPk(presensiId);

    if (!presensi) {
      return res.status(404).json({
        message: "Data presensi tidak ditemukan.",
      });
    }

    if (presensi.userId !== userId) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses ke data ini.",
      });
    }

    await presensi.destroy();
    res.json({ message: "Data presensi berhasil dihapus." });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus data presensi",
      error: error.message,
    });
  }
};

/* =======================
   UPDATE PRESENSI
======================= */
exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;

    if (!checkIn && !checkOut) {
      return res.status(400).json({
        message: "Minimal isi checkIn atau checkOut.",
      });
    }

    const presensi = await Presensi.findByPk(presensiId);

    if (!presensi) {
      return res.status(404).json({
        message: "Data presensi tidak ditemukan.",
      });
    }

    presensi.checkIn = checkIn || presensi.checkIn;
    presensi.checkOut = checkOut || presensi.checkOut;

    await presensi.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: presensi,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui data presensi",
      error: error.message,
    });
  }
};
