import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import  { initializeApp } from 'firebase/app'
import { collection, getDoc, getFirestore, setDoc, doc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore'

//Credenciales de Firebase 
const firebaseConfig = {
    apiKey: "AIzaSyAZYDi99c2VryEAnWgbvXGdFzMDCX_ujwE",
    authDomain: "nuxt-jepm.firebaseapp.com",
    projectId: "nuxt-jepm",
    storageBucket: "nuxt-jepm.appspot.com",
    messagingSenderId: "25039596829",
    appId: "1:25039596829:web:fee6509460fdbf819945f4"
  };   
//Inicalizamos el servidor 
const app = express()

const corsOptions = {
    origin: '*', 
    OptionSuccessStatus: 200
}

//MIDDLWARE 
app.use(cors(corsOptions))
app.use(express.json())

//Ruta de doctores
app.post('/new-doctor', (req, res) => {
    let{ nombre, apaterno, amaterno, email, telefono, especialidad , fecha_nacimiento , password} = req.body

    if(!nombre.length){
        res.json({
            'alert': 'No se ingreso el nombre'
        })
    } else if (!apaterno.length){
        res.json({
            'alert': 'No se ingreso el apellido paterno'
        })
    } else if (!email.length){
        res.json({
            'alert': 'No se ingreso el usuario'
        })
    } else if (!telefono.length){
        res.json({
            'alert': 'No se ingreso el telefono'
        })
    } else if (!especialidad.length){
        res.json({
            'alert': 'No se ingreso la especialidad'
        })
    }
    else if (!fecha_nacimiento.length){
        res.json({
            'alert': 'No se ingreso el dia de nacimiento'
        })
    }
    else if (!password.length){
        res.json({
            'alert': 'No se ingreso el password'
        })
    }

    const clinica = collection(db, 'clinica')

    getDoc(doc(clinica, email)).then(user => {
        if (user.exists()) {
            res.json({
                'alert': 'El doctor ya existe'
            })
        } else {
            //Encryptar la contraseña 
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    const data = {
                        nombre,
                        apaterno, 
                        amaterno, 
                        email, 
                        telefono, 
                        password: hash 
                    }

                    setDoc(doc(clinica, email), data).then(data => {
                        res.json({
                            'alert': 'success', 
                            data
                        })
                    })
                })
            })
        }
    }).catch(error => {
        res.json({
            'alert': 'Error de conexion'
        })
    })
})
app.get('/get-doctor', async (req, res) => {
    try {
        const clinica = []; 
        const data = await collection(db, 'doctor')
        const docs = await getDocs(data)
        docs.forEach((doc) => {
            doctor.push(doc.data())            
        })
        console.log('@@hola', doctor)
        res.json({
            'alert': 'success', 
            doctor
        })
    } catch {
        res.json({
            'alert': 'error getting data',
            error
        })
    }
})
app.post('/delete-doctor', (req , res) => {
    const email = req.body.email
    deleteDoc(doc(collection(db, 'clinica'), email))
    .then(data => {
        res.json ({
            'alert': 'success'
        })
    })
    .catch(err => {
        res.json({
            'alert': 'error',
            err
        })
    })
})

app.post('/edit-doctor', async (req , res) => {
    const {nombre, apaterno, amaterno, email, telefono, especialidad , fecha_nacimiento , password } = req.body
    
    const edited = await updateDoc(doc(db, 'clinica', email), {
        nombre,
        apaterno,
        amaterno,
        telefono,
        especialidad,
        fecha_nacimiento,
    })

    res.json ({
        'alert': 'edited',
        edited
    })
})

// Rutas para pacientes

//Poner el servidor en  modo escucha 
app.listen(5000, () => {
    console.log('Servidor Trabajando: 5000')
})