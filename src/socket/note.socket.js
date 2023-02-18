import { disconnect } from "mongoose"
import {Server} from "socket.io"
import { noteModel } from "../models/note.model.js"

export const socket=(server)=>{
    const io = new Server(server)

    io.on("connection",(socket)=>{
        console.log("User conectado",socket.id)


        const getNotes = async ()=>{
            const notes = await noteModel.find()
            io.emit("server:getNotes",notes)
        }

        getNotes();


        socket.on("client:addNote",async(note)=>{
            await noteModel.create(note)
            getNotes()
        })

        socket.on("client:updateNote",async(note)=>{
            await noteModel.findByIdAndUpdate({_id:note._id},note)
            getNotes()
        })

        socket.on("client:deleteNote",async(id)=>{
            await noteModel.findByIdAndDelete({_id:id}) //utilizar _id en lugar de id
            getNotes()
        })

        socket.on(disconnect,()=>{
            console.log("usuario desconectado", socket.id)
        })

        

    })
}






//Esta función socket crea una nueva conexión de socket usando la librería Socket.io. Esta función toma un parámetro server, que representa el servidor HTTP en el que se ejecutará la conexión de socket.

// const io = new Server(server): Crea una nueva instancia de Server utilizando el servidor HTTP que se proporcionó como argumento.

// io.on("connection", (socket) => {...}): Este evento se activa cuando un nuevo cliente se conecta al servidor. La función anónima que se pasa como argumento se ejecutará cada vez que se conecte un nuevo cliente.

// console.log("User conectado", socket.id): Este log simplemente muestra un mensaje en la consola indicando que un nuevo usuario se ha conectado y su ID de socket.

// const getNotes = async () => {...}: Esta función getNotes es una función asíncrona que se utiliza para obtener todas las notas de la base de datos.

// const notes = await noteModel.find(): Este código usa la operación find del modelo noteModel para obtener todas las notas de la base de datos.

// io.emit("server:getNotes", notes): Este código emite un evento al cliente llamado "server:getNotes" y proporciona las notas obtenidas de la base de datos como argumento.