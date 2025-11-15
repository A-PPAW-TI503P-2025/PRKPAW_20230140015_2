 	exports.addUserData = (req, res, next) => {
 	  console.log('Middleware: Menambahkan data user dummy...');
 	  req.user = {
 	    id: 123,
 	    nama: 'Ifa Asmarani',
 	    role: 'admin' // Bisa diubah ke 'admin' untuk testing akses admin
 	  };
 	  next(); 
 	};
 	
 	exports.isAdmin = (req, res, next) => {
 	  if (req.user && req.user.role === 'admin') {
 	    console.log('Middleware: Izin admin diberikan.');
 	    next(); 
 	  } else {
 	    console.log('Middleware: Gagal! Pengguna bukan admin.');
 	    return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin'});
 	  }
 	};