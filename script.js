mode="";
let level="";
let poin=0;
let nomorSoal = 0;
let totalSoal = 0;
let waktuSisa = 0;
let timerSoal;
let timerInterval = null;

const bankSoalLatihan = {

mudah: [
{a:1,b:-2,c:-3},{a:1,b:4,c:3},{a:2,b:-4,c:1},{a:1,b:-6,c:8},{a:1,b:2,c:-8},
{a:2,b:3,c:-5},{a:1,b:-3,c:2},{a:1,b:5,c:6},{a:2,b:-1,c:-3},{a:1,b:-4,c:4},
{a:1,b:0,c:-9},{a:2,b:2,c:-4},{a:1,b:-1,c:-6},{a:1,b:3,c:-10},{a:2,b:-6,c:9},
{a:1,b:-7,c:10},{a:1,b:6,c:5},{a:2,b:-3,c:-2},{a:1,b:8,c:-15},{a:1,b:-5,c:6}
],

sedang: [
{a:2,b:-8,c:6},{a:3,b:-6,c:-9},{a:2,b:4,c:-10},{a:3,b:-3,c:-6},{a:2,b:-5,c:3},
{a:3,b:7,c:-4},{a:2,b:-9,c:8},{a:3,b:-2,c:-1},{a:2,b:6,c:-7},{a:3,b:-10,c:5},
{a:2,b:-7,c:9},{a:3,b:4,c:-12},{a:2,b:-3,c:-8},{a:3,b:6,c:-15},{a:2,b:-4,c:2},
{a:3,b:-8,c:10},{a:2,b:5,c:-9},{a:3,b:-7,c:6},{a:2,b:-6,c:4},{a:3,b:9,c:-18}
],

susah: [
{a:3,b:-12,c:9},{a:4,b:-8,c:-16},{a:5,b:10,c:-25},{a:3,b:-15,c:18},{a:4,b:12,c:-20},
{a:5,b:-10,c:5},{a:3,b:9,c:-27},{a:4,b:-16,c:8},{a:5,b:15,c:-30},{a:3,b:-6,c:-9},
{a:4,b:20,c:-24},{a:5,b:-5,c:-10},{a:3,b:18,c:-36},{a:4,b:-12,c:6},{a:5,b:25,c:-50},
{a:3,b:-9,c:12},{a:4,b:8,c:-32},{a:5,b:-20,c:15},{a:3,b:21,c:-42},{a:4,b:-4,c:-28}
]

};


function mulaiApp(){

nama=document.getElementById("namaSiswa").value;

if(nama===""){
alert("Masukkan nama!");
return;
}

let data=localStorage.getItem(nama);

if(data){
let last=JSON.parse(data).time;
let sekarang=Date.now();

if(sekarang-last<43200000){
alert("Nama ini sudah bermain. Coba lagi 12 jam lagi.");
return;
}
}

document.getElementById("loginBox").classList.add("hidden");
document.getElementById("menuUtama").classList.remove("hidden");

}

function pilihMode(m){

mode=m;

/* SEMBUNYIKAN SEMUA DULU */
document.getElementById("eksplorasiBox").classList.add("hidden");
document.getElementById("pilihLevel").classList.add("hidden");
document.getElementById("areaSoal").classList.add("hidden");
document.getElementById("dashboard").classList.add("hidden");

if(m==="eksplorasi"){
document.getElementById("eksplorasiBox").classList.remove("hidden");
return;
}

document.getElementById("pilihLevel").classList.remove("hidden");

}

function mulaiLevel(l){

level=l;

/* reset */
poin=0;
nomorSoal=1;

document.getElementById("penjelasan").innerHTML="";
document.getElementById("hasilAnalisis").innerHTML="";
document.getElementById("jawabanUser").value="";
document.getElementById("btnNext").disabled = true;

/* tentukan jumlah soal */
if(mode==="latihan"){
totalSoal = 20;
}
if(mode==="tantangan"){
totalSoal = 50;
}

nomorSoal = 1;
poin = 0;

/* set waktu */
if(level==="mudah"){waktuSisa = 420;}
if(level==="sedang"){waktuSisa = 600;}
if(level==="susah"){waktuSisa = 900;}

document.getElementById("areaSoal").classList.remove("hidden");

/* mulai timer */
mulaiTimer();

buatSoal();

}

function mulaiTimer(){

clearInterval(timerInterval);

timerInterval = setInterval(function(){

waktuSisa--;

// update tampilan skor
document.getElementById("skor").innerHTML =
"Soal: "+nomorSoal+"/"+totalSoal+
" | Poin: "+poin+
" | Waktu: "+waktuSisa+" detik";

// =======================
// ⛔️ JIKA WAKTU HABIS
// =======================
if(waktuSisa <= 0){

clearInterval(timerInterval);

alert("⏰ Waktu habis!");

// simpan hasil
simpanHasil();

// tampilkan hasil akhir
tampilkanHasilAkhir();

// langsung ke dashboard (opsional tapi bagus)
bukaDashboard();

}

},1000);

}

function hitungEksplorasi(){

let a=parseFloat(document.getElementById("a").value);
let b=parseFloat(document.getElementById("b").value);
let c=parseFloat(document.getElementById("c").value);

let xp=-b/(2*a);

document.getElementById("hasilEksplorasi").innerHTML=
"Titik puncak: "+xp;

gambarGrafik(a,b,c);

}

function simpanHasil(){

let dataBaru = {
nama:nama,
mode:mode,
level:level,
poin:poin,
time:Date.now()
};

// ambil data lama
let dataLama = JSON.parse(localStorage.getItem("hasilGame")) || [];

// tambah data baru
dataLama.push(dataBaru);

// simpan kembali
localStorage.setItem("hasilGame", JSON.stringify(dataLama));

}

function bukaDashboard(){

document.getElementById("dashboard").classList.remove("hidden");

let tabel=document.getElementById("tabelHasil");

tabel.innerHTML = `
<tr>
<th>Nama</th>
<th>Mode</th>
<th>Level</th>
<th>Poin</th>
</tr>
`;

// ambil data dari localStorage
let semuaData = JSON.parse(localStorage.getItem("hasilGame")) || [];

// urutkan
semuaData.sort((a,b)=>b.poin-a.poin);

// tampilkan
semuaData.forEach((data)=>{
let row=tabel.insertRow();

row.insertCell(0).innerHTML=data.nama;
row.insertCell(1).innerHTML=data.mode;
row.insertCell(2).innerHTML=data.level;
row.insertCell(3).innerHTML=data.poin;
});

// leaderboard
let leaderboardHTML = "<h3>🏆 Top 3 Siswa Terbaik</h3>";

for(let i=0;i<3 && i<semuaData.length;i++){

let medal = i==0 ? "🥇" : i==1 ? "🥈" : "🥉";

leaderboardHTML += `
<p>${medal} ${semuaData[i].nama} - ${semuaData[i].poin} poin</p>
`;

}

document.getElementById("leaderboard").innerHTML = leaderboardHTML;

}

function soalBerikut(){

buatSoal();

document.getElementById("jawabanUser").value="";
document.getElementById("penjelasan").innerHTML="";
document.getElementById("hasilAnalisis").innerHTML="";

}
let chartLatihan=null;
let chartEksplorasi=null;

function prosesEksplorasi(){

let fungsi = document.getElementById("inputFungsi").value;

// =======================
// 🔥 NORMALISASI WAJIB
// =======================
fungsi = fungsi
  .toLowerCase()
  .replace("y=", "")
  .replace(/\s+/g, "")
  .replace(/²/g, "^2")   // ⬅️ kunci utama
  .replace(/−/g, "-");

// =======================
// 🔥 PARSING AMAN
// =======================
let a = 0, b = 0, c = 0;

// pecah jadi suku
let suku = fungsi.match(/[+-]?[^+-]+/g);

if(!suku){
  alert("Format fungsi tidak dikenali!");
  return;
}

suku.forEach(term => {

  // ===== ax² atau ax^2 =====
  if(/x(\^2|²)/.test(term)){
  let coef = term.replace(/x(\^2|²)/, "");

  // bersihkan karakter aneh
  coef = coef.trim();

  if(coef === "" || coef === "+") {
    a += 1;
  }
  else if(coef === "-") {
    a += -1;
  }
  else {
    let nilai = parseFloat(coef);

    // fallback kalau gagal parsing
    if(isNaN(nilai)){
      a += 1;
    }else{
      a += nilai;
    }
  }
}

  // ====== bx ======
  else if(term.includes("x")){
    let coef = term.replace("x","");

    if(coef === "" || coef === "+") b += 1;
    else if(coef === "-") b += -1;
    else b += parseFloat(coef);
  }

  // ====== konstanta ======
  else{
    let val = parseFloat(term);
    if(!isNaN(val)) c += val;
  }

});

// =======================
// VALIDASI
// =======================
if(isNaN(a) || isNaN(b) || isNaN(c)){
  alert("Terjadi kesalahan membaca fungsi!");
  return;
}

// =======================
// OUTPUT
// =======================
tampilkanPembahasan(a,b,c);
gambarGrafikEksplorasi(a,b,c);

}

function tampilkanPembahasan(a,b,c){

let xs = -b/(2*a);
let yp = a*xs*xs + b*xs + c;

let diskriminan = b*b - 4*a*c;

let x1, x2;
let potongX = "";

if(diskriminan > 0){

x1 = (-b + Math.sqrt(diskriminan)) / (2*a);
x2 = (-b - Math.sqrt(diskriminan)) / (2*a);

potongX = `
Titik potong sumbu X ada dua:<br>
x1 = ${x1.toFixed(2)}<br>
x2 = ${x2.toFixed(2)}<br>
Titik: (${x1.toFixed(2)},0) dan (${x2.toFixed(2)},0)
`;

}
else if(diskriminan === 0){

x1 = (-b)/(2*a);

potongX = `
Grafik menyinggung sumbu X<br>
Titik: (${x1.toFixed(2)},0)
`;

}
else{

potongX = `
Grafik tidak memotong sumbu X karena D < 0
`;

}

let hasil = `
<h3>Analisis Fungsi Kuadrat</h3>

<p>a = ${a}</p>
<p>b = ${b}</p>
<p>c = ${c}</p>

<hr>

<h3>Sumbu Simetri</h3>
<b>x = ${xs.toFixed(2)}</b>

<hr>

<h3>Titik Puncak</h3>
<b>(${xs.toFixed(2)}, ${yp.toFixed(2)})</b>

<hr>

<h3>Titik Potong X</h3>
${potongX}
`;

document.getElementById("hasilAnalisis").innerHTML = hasil;

if(mode === "eksplorasi"){
document.getElementById("hasilEksplorasi").innerHTML = hasil;
}

}

function gambarGrafikEksplorasi(a,b,c) {

if(chartEksplorasi){
chartEksplorasi.destroy();
}

let xs = -b/(2*a);

// tentukan range dinamis di sekitar titik puncak
let range = 10;

// kalau grafik terlalu curam, kecilkan range
if(Math.abs(a) > 3){
  range = 5;
}

// kalau sangat landai, perbesar range
if(Math.abs(a) < 1){
  range = 15;
}

let xmin = Math.floor(xs - range);
let xmax = Math.ceil(xs + range);

let x = [];
let y = [];

for(let i = xmin; i <= xmax; i++){
  x.push(i);
  y.push(a*i*i + b*i + c);
}

chartEksplorasi = new Chart(document.getElementById("grafikEksplorasi"),{
  type:'line',
  data:{
    labels:x,
    datasets:[{
      label:"Grafik Fungsi Kuadrat",
      data:y,
      borderWidth:3,
      tension:0.3
    }]
  },
  options:{
    scales:{
      x:{
        title:{display:true,text:"x"},
        ticks:{ stepSize:1 }
      },
      y:{
        title:{display:true,text:"y"},
        ticks:{
          callback: function(value){
            return value.toFixed(0);
          }
        }
      }
    }
  }
}); // 
}

function buatSoal(){

let a,b,c;

/* =========================
MODE LATIHAN (SOAL TETAP)
========================= */
if(mode==="latihan"){
if(nomorSoal > 20){
   selesaiGame();
   return;
}
let soal = bankSoalLatihan[level][nomorSoal-1];

a = soal.a;
b = soal.b;
c = soal.c;

}

/* =========================
MODE TANTANGAN (RANDOM)
========================= */
if(mode==="tantangan"){

if(level==="mudah"){
a=Math.floor(Math.random()*3)+1;
b=Math.floor(Math.random()*10)-5;
c=Math.floor(Math.random()*10)-5;
}

if(level==="sedang"){
a=Math.floor(Math.random()*5)-2;
if(a==0){a=2;}
b=Math.floor(Math.random()*20)-10;
c=Math.floor(Math.random()*20)-10;
}

if(level==="susah"){
a=Math.floor(Math.random()*8)-4;
if(a==0){a=3;}
b=Math.floor(Math.random()*30)-15;
c=Math.floor(Math.random()*30)-15;
}

}

window.aSoal=a;
window.bSoal=b;
window.cSoal=c;

let teksSoal="f(x) = "+a+"x² ";

if(b>=0){
teksSoal+="+ "+b+"x ";
}else{
teksSoal+=b+"x ";
}

if(c>=0){
teksSoal+="+ "+c;
}else{
teksSoal+=c;
}

document.getElementById("soal").innerHTML=
"Soal "+nomorSoal+" dari "+totalSoal+"<br><br>"+
"Diketahui fungsi:<br><b>"+teksSoal+"</b><br><br>Tentukan sumbu simetri.";

window.jawabanBenar=-b/(2*a);
let btn = document.getElementById("btnNext");
btn.disabled = true;
btn.classList.add("hidden");

}

function cekJawaban(){

let input = document.getElementById("jawabanUser").value;

input = input.replace(",", ".");
input = input.replace(/[^\d.-]/g, "");

let user = parseFloat(input);
let benar = window.jawabanBenar;

let pesan = "";

if(Math.abs(user-benar)<0.01){

pesan="<b style='color:green'>Jawaban benar!</b>";

if(mode==="latihan"){
    if(level==="mudah"){poin+=20;}
    if(level==="sedang"){poin+=35;}
    if(level==="susah"){poin+=50;}
}

if(mode==="tantangan"){
    if(level==="mudah"){poin+=20;}
    if(level==="sedang"){poin+=35;}
    if(level==="susah"){poin+=50;}
}

}else{
pesan="<b style='color:red'>Jawaban belum tepat.</b>";
}

/* tampilkan hasil */
pesan+=`
<br><br>
<b>Jawaban yang benar:</b> x = ${benar.toFixed(2)}
`;

document.getElementById("penjelasan").innerHTML = pesan;

tampilkanPembahasan(window.aSoal,window.bSoal,window.cSoal);
gambarGrafikLengkap(window.aSoal,window.bSoal,window.cSoal);

document.getElementById("skor").innerHTML="Poin: "+poin;

/* ========================= */
/* INI YANG TADI SALAH TEMPAT */
/* ========================= */

let btn = document.getElementById("btnNext");
btn.disabled = false;
btn.classList.remove("hidden");
// 🔒 KUNCI JAWABAN (ANTI CURANG)
document.getElementById("jawabanUser").disabled = true;
document.getElementById("btnCek").disabled = true;

}

function lanjutSoal(){

if(totalSoal === 0) return;

/* reset tampilan */
document.getElementById("jawabanUser").value="";
document.getElementById("penjelasan").innerHTML="";
document.getElementById("hasilAnalisis").innerHTML="";
document.getElementById("jawabanUser").disabled = false;
document.getElementById("btnCek").disabled = false;

/* reset tombol */
let btn = document.getElementById("btnNext");
btn.disabled = true;
btn.classList.add("hidden"); // ⬅️ penting biar hilang

/* HAPUS GRAFIK LAMA */
let canvas = document.getElementById("grafik");

if(canvas){
   let ctx = canvas.getContext("2d");
   ctx.clearRect(0, 0, canvas.width, canvas.height);
}

if(nomorSoal < totalSoal){

nomorSoal++;

/* LANGSUNG buat soal (hapus setTimeout) */
buatSoal();

}else{

clearInterval(timerInterval);

simpanHasil();           // simpan dulu
tampilkanHasilAkhir();   // tampilkan hasil

}

}

function gambarGrafikLengkap(a,b,c){

if(chartLatihan){
chartLatihan.destroy();
}

/* HITUNG NILAI PENTING */
let xs = -b/(2*a);
let yp = a*xs*xs + b*xs + c;

let diskriminan = b*b - 4*a*c;

/* =========================
AUTO SCALE (SAMA KONSEP EKSPLORASI)
========================= */

let range = 10;

if(Math.abs(a) > 3){
  range = 5;
}

if(Math.abs(a) < 1){
  range = 15;
}

let xmin = Math.floor(xs - range);
let xmax = Math.ceil(xs + range);

let x = [];
let y = [];

for(let i = xmin; i <= xmax; i++){
  x.push(i);
  y.push(a*i*i + b*i + c);
}

/* =========================
TITIK PENTING
========================= */

let titik = [];

// titik puncak
titik.push({x: xs, y: yp});

// titik potong Y
titik.push({x: 0, y: c});

// titik potong X (jika ada)
if(diskriminan >= 0){
let x1 = (-b + Math.sqrt(diskriminan))/(2*a);
let x2 = (-b - Math.sqrt(diskriminan))/(2*a);

titik.push({x: x1, y: 0});
titik.push({x: x2, y: 0});
}

/* =========================
CHART
========================= */

chartLatihan = new Chart(document.getElementById("grafik"),{

type:'line',

data:{
labels:x,
datasets:[
{
label:"Grafik Fungsi",
data:y,
borderWidth:3,
tension:0.3
},
{
type:'scatter',
label:"Titik Penting",
data:titik,
pointRadius:6
}
]
},

options:{
scales:{
x:{
title:{display:true,text:"x"},
ticks:{ stepSize:1 }
},
y:{
title:{display:true,text:"y"},
ticks:{
callback:function(value){
return value.toFixed(0);
}
}
}
}
}

});

}

function tampilkanHasilAkhir(){

let maxPoin = 0;

/* hitung poin maksimal */
if(mode==="latihan"){
   if(level==="mudah") maxPoin = 20 * 20;
   if(level==="sedang") maxPoin = 20 * 35;
   if(level==="susah") maxPoin = 20 * 50;
}

if(mode==="tantangan"){
   if(level==="mudah") maxPoin = 50 * 20;
   if(level==="sedang") maxPoin = 50 * 35;
   if(level==="susah") maxPoin = 50 * 50;
}

/* hitung nilai */
let nilai = (poin / maxPoin) * 100;

let pesan = "";

/* kategori nilai */
if(nilai >= 85){
   pesan = "🎉 Selamat! Kamu sangat hebat dalam memahami materi ini!";
}
else if(nilai >= 70){
   pesan = "👍 Bagus! Pemahamanmu sudah baik, terus tingkatkan!";
}
else if(nilai >= 50){
   pesan = "💪 Lumayan! Ayo latihan lagi supaya lebih mahir!";
}
else{
   pesan = "🔥 Jangan menyerah! Coba lagi dan kamu pasti bisa!";
}

function selesaiGame(){

clearInterval(timerInterval);

// simpan hasil
simpanHasil();

// tampilkan hasil akhir
tampilkanHasilAkhir();

// buka dashboard
bukaDashboard();

// sembunyikan area soal
document.getElementById("areaSoal").classList.add("hidden");

}

/* tampilkan hasil */
alert(
"Selesai!\n\n" +
"Nama: " + nama + "\n" +
"Mode: " + mode + "\n" +
"Level: " + level + "\n\n" +
"Poin: " + poin + "\n" +
"Nilai: " + nilai.toFixed(0) + "\n\n" +
pesan
);

}

function exportExcel(){

let tabel = document.getElementById("tabelHasil");

if(!tabel){
alert("Tabel hasil tidak ditemukan!");
return;
}

let tableHTML = tabel.outerHTML.replace(/ /g, "%20");

let filename = "hasil_siswa.xls";

let dataType = 'application/vnd.ms-excel';

let link = document.createElement("a");

link.href = 'data:' + dataType + ', ' + tableHTML;
link.download = filename;

document.body.appendChild(link);

link.click();

document.body.removeChild(link);
}

function resetData(){

let konfirmasi = confirm("Yakin ingin menghapus semua data hasil?");

if(!konfirmasi) return;

// hapus data leaderboard
localStorage.removeItem("hasilGame");

// optional: reset UI tabel
let tabel = document.getElementById("tabelHasil");

if(tabel){
tabel.innerHTML = `
<tr>
<th>Nama</th>
<th>Mode</th>
<th>Level</th>
<th>Poin</th>
</tr>
`;
}

// reset leaderboard juga
document.getElementById("leaderboard").innerHTML = "";

alert("Data berhasil direset!");
}

function tutupDashboard(){

// hentikan timer kalau ada
clearInterval(timerInterval);

// sembunyikan dashboard
document.getElementById("dashboard").classList.add("hidden");

// tampilkan menu utama lagi
document.getElementById("menuUtama").classList.remove("hidden");

// sembunyikan bagian lain (biar bersih)
document.getElementById("areaSoal").classList.add("hidden");
document.getElementById("eksplorasiBox").classList.add("hidden");
document.getElementById("pilihLevel").classList.add("hidden");

}

function kembaliKeMenu(){

clearInterval(timerInterval);

// sembunyikan semua
document.getElementById("dashboard").classList.add("hidden");
document.getElementById("areaSoal").classList.add("hidden");
document.getElementById("eksplorasiBox").classList.add("hidden");
document.getElementById("pilihLevel").classList.add("hidden");

// tampilkan menu utama
document.getElementById("menuUtama").classList.remove("hidden");

}