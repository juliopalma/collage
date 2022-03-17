const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
app.use(express.static('static'));
app.use(express.static('node_modules/bootstrap/dist'));
const expressFileUpload = require('express-fileupload');
const fs = require('fs').promises;

app.use(expressFileUpload({
    limits: { fileSize: 5242880 },
    abortOnLimit: true,
    responseOnLimit: 'El peso del archivo supera el máximo (5Mb)'
}))

nunjucks.configure('templates', {
    express: app,
    autoescape: true,
    watch: true
})

app.get('/', async(req, res) => {

    res.render('formulario.html');
});


app.post('/imagen', async(req, res) => {

    const img = req.files.target_file;
    const posicion = req.body.posicion;

    await img.mv(`static/imgs/imagen-${posicion}.jpg`);

    //res.send('imagen subida de forma exitosa al collage');
    res.redirect('/collage');

});

app.get('/collage', async(req, res) => {

    res.render('collage.html');
});

app.get('/deleteImg/:nombre', async(req, res) => {

    const nombre = req.params.nombre;

    await fs.unlink(`static/imgs/${nombre}`);
    res.redirect('/collage');

});


app.listen(3010, () => console.log("Ejecutando en el puerto 3010"));