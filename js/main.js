// JAVASCRIPT OPEN LOAD SPLITTER
window.fn = {};

window.fn.open = function() {
	var menu = document.getElementById('menu');
	menu.open();
};

window.fn.load = function(page) {
	var content = document.getElementById('content');
	var menu = document.getElementById('menu');
	content.load(page)
	.then(menu.close.bind(menu));
};
// DIALOG LOGIN OPEN
var showTemplateDialog = function() {
	var dialog = document.getElementById('my-dialog');

	if (dialog) {
		dialog.show();
	} else {
		ons.createElement('login.html', { append: true })
		.then(function(dialog) {
			dialog.show();
		});
	}
};
// DIALOG LOGIN CLOSE
var hideDialog = function(id) {
	document
	.getElementById(id)
	.hide();	
};
// COROUSEL DI BERANDA
var prev = function() {
	var carousel = document.getElementById('carousel');
	carousel.prev();
};

var next = function() {
	var carousel = document.getElementById('carousel');
	carousel.next();
};

ons.ready(function() {
	var carousel = document.addEventListener('postchange', function(event) {
		console.log('Changed to ' + event.activeIndex)
	});
});
// JAVASCRIPT ONS TOOLBAR
document.addEventListener('prechange', function(event) {
	document.querySelector('ons-toolbar .center')
	.innerHTML = event.tabItem.getAttribute('label');
});

window.fn.loadLink = function (url) {
	window.open(url, '_blank');
};

////////////////////////////////////////////////////////////////////////////DATABASE
//Cek compatibility browser dalam menangani websql
if (window.openDatabase) {
	//Membuat database, parameter: 1. nama database, 2.versi db, 3. deskripsi 4. ukuran database (dalam bytes) 1024 x 1024 = 1MB
	var mydb = openDatabase("rewo", "0.1", "daftar rewo", 1024 * 1024);

	//membuat tabel person dengan SQL untuk database menggunakan function transaction
	mydb.transaction(function (t) {
		t.executeSql("CREATE TABLE IF NOT EXISTS user (nik TEXT, user TEXT primary key, alamat TEXT, email TEXT, nohp TEXT, pass TEXT, level TEXT");
	});
	mydb.transaction(function (t) {
		t.executeSql("CREATE TABLE IF NOT EXISTS pesan (paket TEXT, hpaket INTEGER, lama INTEGER, food TEXT, tanggal DATE, tempat TEXT, penanggung TEXT, nohp2 TEXT, metode TEXT)");
	});

} else {
	alert("Hp Mu Kurang Canggih Tuku Maneh Reng Anyar !!");
}


function daftar(){

	if (mydb) {
		//mendapatkan nilai dari form
		var nik = document.getElementById('nik').value;
		var user = document.getElementById('user').value;
		var alamat = document.getElementById('alamat').value;
		var email = document.getElementById('email').value;
		var nohp = document.getElementById('nohp').value;
		var pass = document.getElementById('pass').value;

		//cek apakah nilai sudah diinput di form
		if (nik !== "" && user !== "" && alamat !== "" && email !== "" && nohp !== "" && pass !== "") {
			//Insert data yang diisi pada form, tanda ? hanya sebagai placeholder, akan digantikan dengan data array pada parameter kedua
			mydb.transaction(function (t) {
				t.executeSql("INSERT INTO user (nik, user, alamat, email, nohp, pass) VALUES (?, ?, ?, ?, ?, ?)", [nik, user, alamat, email, nohp, pass]);
			});

		} else {
			alert("Data Harus Diisi !");
		}
	} else {
		alert("database tidak ditemukan, browser tidak support web sql !");
	}
}


function login(){
	user = document.getElementById('user').value;
	if (mydb) {
		mydb.transaction(function (t){
			t.executeSql("select * from user where user = ?", [user], validasi)
		});
	}
}


function validasi(transaction, results){
	
	pass = document.getElementById('pass').value;
	if (results.rows.length == 0) {
		alert("Username atau Password Salah");
		document.forms['rewo'].reset();
	}else{
		for(var i=0; i<results.rows.length; i++){
			row = results.rows.item(i);
			email1 = row.email;
			if (row.pass == pass) {
				var modal = document.querySelector('ons-modal');
				modal.show();
				setTimeout(function() {
					modal.hide();
				}, 1000);
				if(row.level == 'admin'){
					window.location='admin.html';
				}else{
					ons.createElement(fn.load('home.html'), { append: true })
					var formholder = document.getElementById("email1");
					formholder.innerHTML = email1;
				}
			} else {
				ons.notification.alert('Incorrect username or password!');
			}
		}	
	}
}


function biaya(){
	paket = document.getElementById("paket").value;
	hpaket = document.getElementById("hpaket").value;
	
	if (paket == "duo") {hasil = 200000}
		if (paket == "trio") {hasil = 300000}
			if (paket == "rombongan") {hasil = 400000}
				if (paket == "rame") {hasil = 500000}

					document.getElementById("hpaket").value = hasil;
			}


function pesan(){

	if (mydb) {
		//mendapatkan nilai dari form
	var paket = document.getElementById('paket').value;
	var hpaket = document.getElementById('hpaket').value;
	var lama = document.getElementById('lama').value;
	var food = document.getElementById('food').value;
	var tanggal = document.getElementById('tanggal').value;
	var tempat = document.getElementById('tempat').value;
	var penanggung = document.getElementById('penanggung').value;
	var nohp2 = document.getElementById('nohp2').value;
	var metode = document.getElementById('metode').value;


		//cek apakah nilai sudah diinput di form
		if (paket !== "" && hpaket !== "" && lama !== "" && food !== "" && tanggal !== "" && tempat !== "" && penanggung !== "" && nohp2 !== "" && metode !== "") {
			//Insert data yang diisi pada form, tanda ? hanya sebagai placeholder, akan digantikan dengan data array pada parameter kedua
			mydb.transaction(function (t) {
				t.executeSql("INSERT INTO pesan (paket, hpaket, lama, food, tanggal, tempat, penanggung, nohp2, metode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [paket, hpaket, lama, food, tanggal, tempat, penanggung, nohp2, metode]);
			});

		} else {
			alert("data harus diisi !");
		}
	} else {
		alert("database tidak ditemukan, browser tidak support web sql !");
	}
}

function show_data() {
	//cek apakah objek mydb sudah dibuat
	if (mydb) {
		//mendapatkan semua data dari databse, set update_list sebagai callback function di dalam executeSql
		mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM user", [], cetak);
		});
		mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM pesan", [], cetak);
		});
	} else {
		alert("database tidak ditemukan, browser tidak support web sql !");
	}
}

function cetakresi() {
	//cek apakah objek mydb sudah dibuat
	if (mydb) {
		mydb.transaction(function (t) {
			// mendapatkan nilai dari komponen list_data
			var formholder = document.getElementById("cetak_resi");

			// clear list di table
			// formholder.innerHTML = " <br>";

			//mengambil data berdasarkan id dan menampilkannya
			t.executeSql("SELECT * FROM pesan where rowid=(select max(rowid) from pesan)", [], function (tx, results) {
				formholder.innerHTML =
				`****************************************************** <br>
				<b>PEMBAYARAN PESAN JURU MASAK REWO <b><br>
				****************************************************** <br>
				Jenis Paket Pekerja : ${results.rows.item(0).paket} <br>
				Jenis Paket Masakan : ${results.rows.item(0).food} <br>
				Tanggal Acara       : ${results.rows.item(0).tanggal}<br>
				Alamat : <br>${results.rows.item(0).tempat}<br>
				Penanggung Jawab    : ${results.rows.item(0).penanggung}<br>
				Nomor Telephone     : ${results.rows.item(0).nohp2}<br>
				Pembayaran Via ${results.rows.item(0).metode}<br>
				******************************************************`;
			});
		});
	} else {
		alert("databse tidak ditemukan, browser tidak support web sql !");
	}
}
