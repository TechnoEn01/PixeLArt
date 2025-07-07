const game = document.querySelector('#game');
const curseur = document.querySelector('#curseur');
const grilleCellSize = 10;

const ctx = game.getContext('2d');
const grille =game.getContext('2d');

ctx.beginPath();
ctx.fillStyle = "green";
ctx.fillRect(50, 10, 100, 100);


const pixelSize = grilleCellSize;
const cols = 100;
const rows = 100;
game.width = 1200;
game.height = 600;

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDK5J8aRUqLLw7WMlW62q9GLSZqYmRStCo",

  authDomain: "pixelart-5db8e.firebaseapp.com",

  projectId: "pixelart-5db8e",

  storageBucket: "pixelart-5db8e.firebasestorage.app",

  messagingSenderId: "988294246845",

  appId: "1:988294246845:web:cabfe6d92594be514ca2d4",

  measurementId: "G-DP38TH7YWE"

};


// Initialize Firebase

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();



function placePixel() {
    const r = Math.max(0, Math.min(255, parseInt(document.getElementById('red').value) || 0));
    const g = Math.max(0, Math.min(255, parseInt(document.getElementById('green').value) || 0));
    const b = Math.max(0, Math.min(255, parseInt(document.getElementById('blue').value) || 0));
    const col = Math.max(0, Math.min(cols-1, parseInt(document.getElementById('col').value) || 0));
    const row = Math.max(0, Math.min(rows-1, parseInt(document.getElementById('row').value) || 0));
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
    const pixel = {
        col: col,
        row: row,
        color: `rgb(${r},${g},${b})`
    }

    const pixelRef = db.collection('pixels').doc(`${col}-${row}`);
    pixelRef.set(pixel, { merge: true } )
        .then(() => {
            console.log("Pixel saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving pixel: ", error);
        });
}


function drawGrid(ctx, width, height, cellwith, cellHeight) {
   ctx.beginPath();
   ctx.strokeStyle = '#ccc';

   for (let x = 0; x <= width; x++) {
       ctx.moveTo(x*cellwith, 0);
       ctx.lineTo(x*cellwith, height);
   }
   ctx.stroke()
    
   for (let x = 0; x <= height; x++) {
       ctx.moveTo(0, x*cellHeight);
       ctx.lineTo(width, x*cellHeight);
   }
   ctx.stroke()
}
drawGrid(grille, game.width,game.height, grilleCellSize,grilleCellSize)

game.addEventListener('mousemove', function(event){
  

    const curseurLeft = event.clientX - (curseur.offsetWidth/2)
    const curseurTop = event.clientY - (curseur.offsetHeight/2)

    
    
    curseur.style.left = Math.floor(curseurLeft / grilleCellSize) * grilleCellSize + "px"
    curseur.style.top = Math.floor(curseurTop / grilleCellSize) * grilleCellSize + "px"

    // Affiche les coordonnées dans le curseur lui-même pour plus de réactivité
    curseur.textContent = Math.floor(curseurLeft / grilleCellSize)+" " + Math.floor(curseurTop / grilleCellSize);
    // Optionnel : retire l'info-bulle native pour éviter le délai
    curseur.title = '';
})

// ...existing code...
db.collection('pixels').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
            const pixel = change.doc.data();
            ctx.fillStyle = pixel.color;
            ctx.fillRect(pixel.col * pixelSize, pixel.row * pixelSize, pixelSize, pixelSize);
        }
    });
}); // <-- parenthèse et point-virgule ajoutés ici
// ...existing code...