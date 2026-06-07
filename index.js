const express = require('express');
const path = require('path');
const fs = require('fs'); // 1. Importăm modulul fs pentru a citi fișierul JSON
const app = express();
const port = 8080;

// Citim fișierul JSON la pornirea serverului
let erori = JSON.parse(fs.readFileSync('erori.json', 'utf8'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'resurse')));

app.get(['/', '/index', '/home'], (req, res) => {
    res.render('pagini/index', { title: 'Creative Store | Materiale de creație' });
});

// Ruta generală pentru orice altă pagină
app.get('/:pagina', (req, res) => {
    let numePagina = req.params.pagina;

    res.render('pagini/' + numePagina, { title: 'Creative Store | ' + numePagina }, (err, html) => {
        if (err) {
            
            if (err.message.startsWith("Failed to lookup view")) {
                let eroareGasita = erori.info_erori.find(e => e.identificator == 404) || erori.eroare_default;

                // Obiectul de mai jos trimite variabilele către 404.ejs
                res.status(404).render('pagini/404', {
                    titlu: eroareGasita.titlu,
                    text: eroareGasita.text,
                    imagine: erori.cale_baza + eroareGasita.imagine
                });
            }
            else {
                // 4. Eroare generică (500) folosind datele default din JSON
                console.error("Eroare la randare:", err);
                res.status(500).render('pagini/eroare', {
                    titlu: erori.eroare_default.titlu,
                    text: erori.eroare_default.text,
                    imagine: erori.cale_baza + erori.eroare_default.imagine
                });
            }
        } else {
            res.send(html);
        }
    });
});

app.listen(port, () => {
    console.log(`Serverul rulează la adresa http://localhost:${port}`);
});