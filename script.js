let mode="";
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

document.getElementById("skor").innerHTML =
"Soal: "+nomorSoal+"/"+totalSoal+
" | Poin: "+poin+
" | Waktu: "+waktuSisa+" detik";

if(waktuSisa <= 0){

clearInterval(timerInterval);
alert("Waktu habis!");
selesaiGame();

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

let data={
nama:nama,
mode:mode,
level:level,
poin:poin,
time:Date.now()
};

localStorage.setItem(nama,JSON.stringify(data));

}

function bukaDashboard(){

document.getElementById("dashboard").classList.remove("hidden");

/* RESET TABEL */
let tabel=document.getElementById("tabelHasil");

tabel.innerHTML = `
<tr>
<th>Nama</th>
<th>Mode</th>
<th>Level</th>
<th>Poin</th>
</tr>
`;

/* AMBIL DATA */
let semuaData = [];

for(let i=0;i<localStorage.length;i++){

let key=localStorage.key(i);
let data=JSON.parse(localStorage.getItem(key));

semuaData.push(data);

}

/* URUTKAN DARI TERBESAR */
semuaData.sort((a,b)=>b.poin-a.poin);

/* TAMPILKAN KE TABEL */
semuaData.forEach((data)=>{
let row=tabel.insertRow();

row.insertCell(0).innerHTML=data.nama;
row.insertCell(1).innerHTML=data.mode;
row.insertCell(2).innerHTML=data.level;
row.insertCell(3).innerHTML=data.poin;
});

/* ======================= */
/* LEADERBOARD TOP 3 */
/* ======================= */

let leaderboardHTML = "<h3>🏆 Top 3 Siswa Terbaik</h3>";

for(let i=0;i<3 && i<semuaData.length;i++){

let medal = "";

if(i==0) medal="🥇";
if(i==1) medal="🥈";
if(i==2) medal="🥉";

leaderboardHTML += `
<p>${medal} ${semuaData[i].nama} - ${semuaData[i].poin} poin</p>
`;

}

document.getElementById("leaderboard").innerHTML = leaderboardHTML;

}

function tutupDashboard(){
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("menuUtama").classList.remove("hidden");
}


function exportExcel(){

let table=document.getElementById("tabelHasil").outerHTML;

let data='data:application/vnd.ms-excel,'+encodeURIComponent(table);

let link=document.createElement("a");

link.href=data;
link.download="hasil_siswa.xls";

link.click();

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

let fungsi=document.getElementById("inputFungsi").value;

fungsi=fungsi.replace("y=","");
fungsi=fungsi.replace(/\s/g,'');

let a=1;
let b=0;
let c=0;

let matchA=fungsi.match(/([+-]?\d*)x\^2/);
if(matchA){
a=matchA[1];
if(a===""||a==="+") a=1;
if(a==="-" ) a=-1;
a=parseFloat(a);
}

let matchB=fungsi.match(/([+-]\d*)x(?!\^)/);
if(matchB){
b=parseFloat(matchB[1]);
}

let matchC=fungsi.match(/([+-]\d+)$/);
if(matchC){
c=parseFloat(matchC[1]);
}

tampilkanPembahasan(a,b,c);

gambarGrafikEksplorasi(a,b,c);

}

function tampilkanPembahasan(a,b,c){

let xs = -b/(2*a);
let yp = a*xs*xs + b*xs + c;

let diskriminan = b*b - 4*a*c;

let x1="";
let x2="";
let potongX="";

if(diskriminan>0){

x1 = (-b + Math.sqrt(diskriminan))/(2*a);
x2 = (-b - Math.sqrt(diskriminan))/(2*a);

potongX = `
Titik potong sumbu X ada dua:<br>
x1 = ${x1.toFixed(2)}<br>
x2 = ${x2.toFixed(2)}<br>
Titik: (${x1.toFixed(2)},0) dan (${x2.toFixed(2)},0)
`;

}

else if(diskriminan==0){

x1 = (-b)/(2*a);

potongX = `
Grafik menyinggung sumbu X<br>
Titik: (${x1.toFixed(2)},0)
`;

}

else{

potongX = `
Grafik tidak memotong sumbu X karena
D < 0
`;

}

let hasil = `

<h3>Analisis Fungsi Kuadrat</h3>

<p>Bentuk umum:</p>

<b>y = ax² + bx + c</b>

<p>a = ${a}</p>
<p>b = ${b}</p>
<p>c = ${c}</p>

<hr>

<h3>Sumbu Simetri</h3>

x = -b / 2a

<br>

x = -(${b}) / (2 × ${a})

<br>

<b>x = ${xs.toFixed(2)}</b>

<hr>

<h3>Titik Puncak</h3>

xp = ${xs.toFixed(2)}

<br>

yp = ${yp.toFixed(2)}

<br>

<b>(${xs.toFixed(2)} , ${yp.toFixed(2)})</b>

<hr>

<h3>Titik Potong Sumbu Y</h3>

Jika x = 0

<br>

y = ${c}

<br>

<b>(0 , ${c})</b>

<hr>

<h3>Titik Potong Sumbu X</h3>

Diskriminan

<br>

D = b² - 4ac

<br>

D = (${b})² - 4(${a})(${c})

<br>

D = ${diskriminan}

<br><br>

${potongX}

<hr>

<h3>Arah Parabola</h3>

${a>0 ? "Parabola terbuka ke atas" : "Parabola terbuka ke bawah"}

`;
if(mode==="eksplorasi"){
document.getElementById("hasilEksplorasi").innerHTML = hasil;
}
document.getElementById("hasilAnalisis").innerHTML = hasil;
}


function gambarGrafikEksplorasi(a,b,c){

if(chartEksplorasi){
chartEksplorasi.destroy();
}

let x=[];
let y=[];

for(let i=-10;i<=10;i++){

x.push(i);

y.push(a*i*i+b*i+c);

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
title:{display:true,text:"x"}
},
y:{
title:{display:true,text:"y"}
}
}
}

});

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

}

function lanjutSoal(){

if(totalSoal === 0) return;

/* reset tampilan */
document.getElementById("jawabanUser").value="";
document.getElementById("penjelasan").innerHTML="";
document.getElementById("hasilAnalisis").innerHTML="";

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

selesaiGame();
simpanHasil();

}

}

function gambarGrafikLengkap(a,b,c){

if(chartLatihan){
chartLatihan.destroy();
}

let xs=-b/(2*a);
let yp=a*xs*xs+b*xs+c;

let diskriminan=b*b-4*a*c;

let x=[];
let y=[];

for(let i=-10;i<=10;i++){

x.push(i);
y.push(a*i*i+b*i+c);

}

let titikX=[];
let titikY=[];

titikX.push(xs);
titikY.push(yp);

titikX.push(0);
titikY.push(c);

if(diskriminan>=0){

let x1=(-b+Math.sqrt(diskriminan))/(2*a);
let x2=(-b-Math.sqrt(diskriminan))/(2*a);

titikX.push(x1);
titikY.push(0);

titikX.push(x2);
titikY.push(0);

}

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
data:titikX.map((v,i)=>({x:v,y:titikY[i]})),
pointRadius:6
}

]

},

options:{
scales:{
x:{title:{display:true,text:"x"}},
y:{title:{display:true,text:"y"}}
}
}

});

}

document.getElementById("hasilEksplorasi").innerHTML="";
document.getElementById("hasilAnalisis").innerHTML="";
document.getElementById("penjelasan").innerHTML="";


function selesaiGame(){

clearInterval(timerInterval);

tampilkanHasilAkhir();

simpanHasil();

/* reset tampilan */
document.getElementById("areaSoal").classList.add("hidden");
document.getElementById("menuUtama").classList.remove("hidden");

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