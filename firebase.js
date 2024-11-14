// Importa Firebase y Firestore desde el SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDoQR0NsthinwvLW9DqzZRLiv1uUcw7CiM",
    authDomain: "prueba-57ad6.firebaseapp.com",
    projectId: "prueba-57ad6",
    storageBucket: "prueba-57ad6.firebasestorage.app",
    messagingSenderId: "294770175711",
    appId: "1:294770175711:web:2d8fd3ebc87181573d036a"
};
// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencia a la colección 'usuarios' en Firestore
const usersCollection = collection(db, 'usuarios');

// Función para obtener y mostrar usuarios
async function fetchUsers() {
    const usersSnapshot = await getDocs(usersCollection);
    const usersTableBody = document.querySelector("#usersTable tbody");
    usersTableBody.innerHTML = ""; // Limpia la tabla antes de cargar nuevos datos

    usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const userRow = document.createElement("tr");

        userRow.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${userData.nombre}</td>
            <td class="px-6 py-4 whitespace-nowrap">${userData.apellido}</td>
            <td class="px-6 py-4 whitespace-nowrap">${userData.correo}</td>
            <td class="px-6 py-4 whitespace-nowrap">${userData.cedula}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
                <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mr-2" onclick="editUser('${userDoc.id}', '${userData.nombre}', '${userData.apellido}', '${userData.correo}', '${userData.cedula}')">Editar</button>
                <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded" onclick="deleteUser('${userDoc.id}')">Eliminar</button>
            </td>
        `;

        usersTableBody.appendChild(userRow);
    });
}

// Función para agregar o actualizar un usuario
async function saveUser(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const cedula = document.getElementById("cedula").value;
    const userId = document.getElementById("userId").value; // Recupera el ID si estamos en modo edición

    if (userId === "") {
        // Agregar nuevo usuario
        await addDoc(usersCollection, { nombre, apellido, correo, cedula });
    } else {
        // Actualizar usuario existente
        const userRef = doc(db, "usuarios", userId);
        await updateDoc(userRef, { nombre, apellido, correo, cedula });
        document.getElementById("userId").value = ""; // Limpia el campo de ID después de actualizar
    }

    document.getElementById("userForm").reset(); // Limpia el formulario
    fetchUsers(); // Actualiza la lista de usuarios
}

// Función para editar un usuario (prellenar el formulario)
window.editUser = function (id, nombre, apellido, correo, cedula) {
    document.getElementById("nombre").value = nombre;
    document.getElementById("apellido").value = apellido;
    document.getElementById("correo").value = correo;
    document.getElementById("cedula").value = cedula;
    document.getElementById("userId").value = id; // Usa un campo oculto para almacenar el ID del usuario
}

// Función para eliminar un usuario
window.deleteUser = async function (id) {
    const userRef = doc(db, "usuarios", id);
    await deleteDoc(userRef);
    fetchUsers(); // Actualiza la lista de usuarios después de eliminar
}

// Agrega el evento submit al formulario
document.getElementById("userForm").addEventListener("submit", saveUser);

// Campo oculto para almacenar el ID del usuario que se está editando
const userIdInput = document.createElement("input");
userIdInput.type = "hidden";
userIdInput.id = "userId";
document.getElementById("userForm").appendChild(userIdInput);

// Cargar los usuarios al iniciar la página
fetchUsers();