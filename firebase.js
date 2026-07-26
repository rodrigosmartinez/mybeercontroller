const firebaseConfig = {
  apiKey: "AIzaSyBcqFW9oxAxYNfzPpy01UC7XcCZi4rZR1Q",
  authDomain: "meuprojetoiot-c9370.firebaseapp.com",
  databaseURL: "https://meuprojetoiot-c9370-default-rtdb.firebaseio.com",
  projectId: "meuprojetoiot-c9370"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();