
let database; let foods;
let storage; let upload;

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
        form = document.getElementById("form");

    } catch (e) {
        console.error(e);
    }
});


form.addEventListener("submit", function(e) {
    e.preventDefault();
    let name = form.name.value;
    let description = form.description.value;

    let newFile = storage.child(`food/${name}.jpeg`);
    console.log(newFile)
    newFile.put(form.file.files[0]);

    let newFood = database.ref(`food/${name}`).set({
        name: name,
        description: description
    });


    Promise.all([newFile, newFood]).then((snapshot) => {
        window.location.href = "/viewfood.html?id=" + name;
    })

    
    console.log("gsdf")
});



function NewComment(positive, comment) {

    let newComment = comments.push();
    newComment.set({
        userId: "meow",
        positive: positive,
        comment: comment
    });

}

window.NewComment = NewComment;