
let database; let comments; let foodName;
let storage;
let form;

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

        let params = new URLSearchParams(document.location.search);
        console.log(params)

        foodName = params.get("id");

        //food = database.ref(`food/${params.id}`);
        let foodDb = database.ref(`food/${foodName}`).get();
        
        let foodImg;
        let foodImgPromise = storage.child(`food/${foodName}.jpeg`).getDownloadURL();
        Promise.all([foodImgPromise, foodDb])
            .then(data => {
                console.log("got url")
            
                console.log("got db")

                console.log(data);
                document.getElementById("info").innerHTML = `
                    <h1>${foodName}</h1>
                    <img src="${data[0]}"/>
                    
                `;
                let description = data[1].description;
                if (description) {
                    document.getElementById("info").innerHTML += `<p>${description}</p>`;
                }
            })

        comments = database.ref("comments").orderByChild("food").equalTo(foodName)
        console.log(comments)

        RefreshComments();
        //comments.on("value", RefreshComments);
        comments.on("child_added", RefreshComments);
        comments.on("child_changed", RefreshComments)
        comments.on("child_removed", RefreshComments);

        form = document.getElementById("form");
        form.addEventListener("submit", NewComment);

 
    } catch (e) {
        console.error(e);
    }
});

// Crude comment refresh
function RefreshComments(data) {
    let commentsHTML = "";
    comments.once("value", (snapshot) => {
        snapshot.forEach((item) => {
            let value = item.val();
            commentsHTML += `
            <fieldset>
                <legend>${value.userId} awoos...</legend>
                <p>I love it: ${value.positive}</p>
                <p>${value.comment}</p>
            </fieldset>
            `;
        });
        document.getElementById("comments").innerHTML = commentsHTML;

    }).then(() => {
        
    });

    

}

function NewComment(e) {
    e.preventDefault();

    let username = form.name.value;
    let comment = form.comment.value;
    let positive = form.positive.checked;

    let newComment = database.ref("comments").push();
    newComment.set({
        userId: username,
        positive: positive,
        comment: comment,
        food: foodName
    });

}

window.NewComment = NewComment;