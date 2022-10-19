
let database; let foods;
let storage;

document.addEventListener('DOMContentLoaded', function () {
    const loadEl = document.querySelector('#load');
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.firestore().doc('/foo/bar').get().then(() => { });
    // firebase.functions().httpsCallable('yourFunction')().then(() => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    // firebase.analytics(); // call to activate
    // firebase.analytics().logEvent('tutorial_completed');
    // firebase.performance(); // call to activate
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    try {
        let app = firebase.app();
        let features = [
            'auth',
            'database',
            'firestore',
            'functions',
            'messaging',
            'storage',
            'analytics',
            'remoteConfig',
            'performance',
        ].filter(feature => typeof app[feature] === 'function');

        database = firebase.database();
        storage = firebase.storage().ref();
        foods = database.ref("food");

        //RefreshFoods();
        foods.on("child_added", RefreshFoods);
        foods.on("child_changed", RefreshFoods);
        foods.on("child_removed", RefreshFoods);
        window.foodsFile = foods;

    } catch (e) {
        console.error(e);
    } finally {
        //RefreshFoods();
    }
});

// Crude comment refresh
function RefreshFoods() {
    console.log("refresh")
    
    foods.get().then(async (snapshot) => {
        let foodDictionary = snapshot.val()
        let foodIds = Object.keys(foodDictionary);
        let foodHTML = "";

        for (var i = 0; i < foodIds.length; i++) {
            let foodName = foodDictionary[foodIds[i]].name;



            let downloadUrl = await storage.child(`food/${foodName}.jpeg`).getDownloadURL();
            
            foodHTML += `
                <a href="/viewfood?id=${foodName}">
                    <img src="${downloadUrl}"/>
                    <p>${foodName}</p>
                </a>
                `;
        }
        document.getElementById("foods").innerHTML = foodHTML;
    });
}

window.RefreshFoods = RefreshFoods;