import { collection, addDoc } from "firebase/firestore";
import java.util.Scanner;

public class DataGathering(){//params are the data being brought in
//frontend sends data - userID, userlog info
//
    Scanner userIn = new Scanner(System.in);

    //how is it determined which method is called? in the private class??

}

private class documentCreation(){    
    // Create a reference to the users collection
    const usersRef = collection(db, "users");
    const userlogRef = collection(db, "userlog");
    const activeSightRef = collection(db, "activeSightings");

    public void userUpdate(){
    // Add a new document with an auto-generated ID
    const newUserRef = await addDoc(usersRef, {
    name: userIn.nextLn(),//depends on how the data is read into this method
    email: userIn.nextLn(),
    createdAt: new Date().toISOString()
    });

    console.log("New user added with ID: ", newUserRef.id);
    }

    public void userlogUpdate(){
        // Add a new document with an auto-generated ID
        const newUserlogRef = await addDoc(userslogRef, {
            //userID = reference to users 
            //speciesID = reference to "superlogs" wildlife library
                //Species Name:query
                //Common Name:query
                //FieldNotes:query
                //Photoref: read in photo url
            //Author: user name
            createdAt: new Date().toISOString(),
            location: //read in coords
    });

        console.log("New userlog added with ID: ", newUserlogRef.id);
    }

    public void activeSightingsUpdate(){
        // Add a new document with an auto-generated ID
        const newActiveSightRef = await addDoc(activeSightRef, {
            //userID = reference to users 
            //Photoref: read in photo url(user or proffesional?)
            createdAt: new Date().toISOString(),
            location: //read in coords
            decayTime: //1 hour after being created
            //what is the mechnism for decay???
    });

        console.log("New activeSight added with ID: ", newActiveSightRef.id);
    }

}


//fetch request for nearby sightings
//data in with sighting info.//