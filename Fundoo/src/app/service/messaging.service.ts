import { Injectable }          from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth }     from 'angularfire2/auth';
import * as firebase from 'firebase';

//import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MessagingService {

  // messaging = firebase.messaging()
  // currentMessage = new BehaviorSubject(null)

  // constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) { }
messaging ;
// = firebase.messaging()
currentMessage = new BehaviorSubject(null)

constructor() {
try{
firebase.initializeApp({
'messagingSenderId': '165607042871'
});
this.messaging=firebase.messaging();
}catch(err){
console.log('Firebase intial',err.stack);
}
}


  // updateToken(token) {
  //   this.afAuth.authState.subscribe(user => {
  //     if (!user) return;

  //     const data = { [user.uid]: token }
  //     this.db.object('fcmTokens/').update(data)
  //   })
  // }

  getPermission() {
      this.messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return this.messaging.getToken()
      })
      .then(token => {
        console.log(token)
        // this.updateToken(token)
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
    }

    receiveMessage() {
       this.messaging.onMessage((payload) => {
        console.log("Message received. ", payload);
        this.currentMessage.next(payload)
      });

    }
}