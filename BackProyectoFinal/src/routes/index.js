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

//Rutas de trabajo
app.post('/new-user', (req, res) => {
    let{ nombre, apaterno, amaterno, email, telefono, password} = req.body

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
    } else if (!password.length){
        res.json({
            'alert': 'No se ingreso el password'
        })
    }

    const usuarios = collection(db, 'usuarios')

    getDoc(doc(usuarios, email)).then(user => {
        if (user.exists()) {
            res.json({
                'alert': 'El usuario ya existe'
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

                    setDoc(doc(usuarios, email), data).then(data => {
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
app.get('/get-users', async (req, res) => {
    try {
        const usuarios = []; 
        const data = await collection(db, 'usuarios')
        const docs = await getDocs(data)
        docs.forEach((doc) => {
            usuarios.push(doc.data())            
        })
        console.log('@@hola', usuarios)
        res.json({
            'alert': 'success', 
            usuarios
        })
    } catch {
        res.json({
            'alert': 'error getting data',
            error
        })
    }
})
app.post('/delete-user', (req , res) => {
    const email = req.body.email
    deleteDoc(doc(collection(db, 'usuarios'), email))
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

app.post('/edit-user', async (req , res) => {
    const {nombre , apaterno , amaterno , telefono , password , email } = req.body
    
    const edited = await updateDoc(doc(db, 'usuarios', email), {
        nombre,
        apaterno,
        amaterno,
        telefono
    })

    res.json ({
        'alert': 'edited',
        edited
    })
})

//Poner el servidor en  modo escucha 
app.listen(5000, () => {
    console.log('Servidor Trabajando: 5000')
})