
import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NoteService } from 'src/app/service/note.service';
import decode from 'jwt-decode';
import { debug } from 'util';
import * as moment from 'moment';
import { ViewService } from 'src/app/service/view.service';
import { MatDialog, MatIconRegistry, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { EditnotesComponent } from '../editnotes/editnotes.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { LabelService } from 'src/app/service/label.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})

export class NotesComponent implements OnInit {

  flag = true;
  model: any = {};
  email: any;
  note: string[];
  title = new FormControl('', [Validators.required, Validators.required]);
  noteContent = new FormControl('', [Validators.required, Validators.required]);
  labelnme =  new FormControl('', [Validators.required, Validators.required]);
  labelnme1 = new FormControl('', [Validators.required, Validators.required]);
  labelToSend;
  chooseDate = new FormControl();
  card: any;
  currentDateAndTime: string;
  timer: any;
  view;
  wrap: string = "wrap";
	direction: string = "row";
  layout: string = this.direction + " " + this.wrap;
  public color = "";
  dateTime: any;
  notesdata: any;
  image: string;
  uid;
  notes: [];
  labels: string[];

  constructor(private labelser: LabelService,private noteService:NoteService,private viewservice :ViewService,public dialog: MatDialog,iconRegistry: MatIconRegistry,sanitizer: DomSanitizer,private snackBar: MatSnackBar ) {

      this.viewservice.getView().subscribe((res=>{
        this.view =res;
        this.direction = this.view.data;
        this.layout = this.direction + " " + this.wrap;
      }))
    const tokens = localStorage.getItem('token');
    const tokenPayload = decode(tokens);
    this.uid = tokenPayload.id;
   }


  ngOnInit() {
    this.displayNotes();
    this.displayLabels();
    this.timer = false;

      this.viewservice.getView().subscribe((res=>{
        this.view = res;
        this.direction = this.view.data;
        this.layout = this.direction + " "+this.wrap;
    }))
    const tokens = localStorage.getItem('token');
    const tokenPayload = decode(tokens);
    this.uid = tokenPayload.id;
    // setInterval(() => {
		// 	this.remaindme();
		// }, 2000);
  }

  flip()
  {
    this.flag = !this.flag;
  }

  noteLabel(n)
  {
    debugger;
    if(n == '01')
    {
      this.labelToSend = this.labelnme1.value;

      this.model = {
        "labelname": this.labelnme1.value
      }

      if(this.labelToSend !='')
      {
        let labeln = this.labelser.setLabel(this.uid,this.model);
      
        labeln.subscribe((res: any) => {
          this.displayLabels();
          this.labelnme1.setValue('');
        });

      }
    }
    else
    {
      this.labelToSend = n.label;
    }
  
  }

  displayNotes()
  {
    debugger;
    const tokens = localStorage.getItem('token');
    const tokenPayload = decode(tokens);
    const id = tokenPayload.id;
    let obs = this.noteService.displayNote(id);
      
      obs.subscribe((data: any) => {
        debugger;
        this.note = data as string[];
        console.log(this.note);
      });
  
  }

  close(n) {
    this.model = {
      "labelname": this.labelnme.value,
      "id": n.id
    }

    debugger;
    if(this.labelnme.value != "")
    {
      let label = this.labelser.setLabel(this.uid,this.model);
    
      label.subscribe((res: any) => {
        this.displayLabels();
        this.labelnme.setValue('');
      });
    }
    
  }

  respl;
  addNote()
  {
    debugger;
    this.email = localStorage.getItem('email');
    this.model =
        {
          "title":this.title.value,
          "noteContent":this.noteContent.value,
          "email":this.email,
          "date":this.currentDateAndTime,
          "color":this.color,
          "image":this.image,
          "labelToSend":this.labelToSend
        }

      if(this.title.value != "" || this.noteContent.value != "" || this.currentDateAndTime != undefined && this.currentDateAndTime != "")
      {
        let obj = this.noteService.addNote(this.model);
        
        obj.subscribe((res: any) => 
        {
          this.respl = res;
          debugger;
          console.log("current",this.respl.message);

          if (res.message == "200") 
          {
            this.displayNotes();
            this.flag = true;

            this.note.forEach(element => {

              let noteobj:any;
    
              
              noteobj.title = this.title.value;
              noteobj.noteContent = this.noteContent.value;
              noteobj.date = this.currentDateAndTime
              noteobj.color = this.color;
    
    
              this.note.push(noteobj);
            });

          } 
          else 
          {
            
          }
        });
      }
      debugger;
      this.flag = true; 

      if(this.currentDateAndTime == undefined)
      {
        this.dateTime = false;
      }
      else
      {
        this.dateTime = true;
      }
      this.title.setValue('');
      this.noteContent.setValue('');
      this.email = '';
      this.currentDateAndTime = '';
      this.color = '';
      this.timer = false;
      this.image = '';

  }

  fulldate: any;
	fulltime: any;
	/**
	 * functin for set reminder for today button
	 */
	today(n) {
    debugger;
		var day = new Date();
		this.fulldate = day.toDateString();
		let currentDate = moment(this.fulldate).format("DD/MM/YYYY");
    this.currentDateAndTime = currentDate + " " + " 08:00 PM";
    this.timer = true;
    if(n.id != undefined)
    {
      this.timer = false;
      let cdate = this.noteService.changeDate(n.id,this.currentDateAndTime);
      this.currentDateAndTime = "";
      cdate.subscribe((res:any)=>{
        console.log(res);
        if (res.message == "200") 
          {
            this.displayNotes();
          } 
          else 
          {
            
          }
      })
    }
	}

	tomorrow(n) {
		debugger;
		var day = new Date();
		day.setDate(day.getDate() + 1);
		this.fulldate = day.toDateString();
		let currentDate = moment(this.fulldate).format("DD/MM/YYYY");
		this.currentDateAndTime = currentDate + " " + " 08:00 AM";
    this.timer = true;
    if(n.id != undefined)
    {
      this.timer = false;
      let cdate = this.noteService.changeDate(n.id,this.currentDateAndTime);
      this.currentDateAndTime = "";
      cdate.subscribe((res:any)=>{
        console.log(res);
        if (res.message == "200") 
          {
            this.displayNotes();
          } 
          else 
          {
            
          }
      })
    }
	}

	nextWeek(n) {
		debugger;
		var day = new Date();

		this.fulldate = day.setDate(day.getDate() + ((1 + 7 - day.getDay()) % 7));
		let currentDate = moment(this.fulldate).format("DD/MM/YYYY");
		this.currentDateAndTime = currentDate + " " + " 08:00 PM";
    this.timer = true;
    if(n.id != undefined)
    {
      this.timer = false;
      let cdate = this.noteService.changeDate(n.id,this.currentDateAndTime);
      this.currentDateAndTime = "";
      cdate.subscribe((res:any)=>{
        console.log(res);
        if (res.message == "200") 
          {
            this.displayNotes();
          } 
          else 
          {
            
          }
      })
    }
    
  }
  
  choosingDate(cdate)
  {
    var choose = moment(this.chooseDate.value).format("DD/MM/YYYY");
    if(cdate == 'morning')
    {
      this.currentDateAndTime = choose + " " + " 08:00 AM";
      this.timer = true;
    }
    if(cdate == 'afternoon')
    {
      this.currentDateAndTime = choose + " " + " 01:00 PM";
      this.timer = true;
    }
    if(cdate == 'evening')
    {
      this.currentDateAndTime = choose + " " + " 06:00 PM";
      this.timer = true;
    }
    if(cdate == 'night')
    {
      this.currentDateAndTime = choose + " " + " 08:00 M";
      this.timer = true;
    }
  }

  setColorToTitle(changecolor) {
		this.color = changecolor;
  }

  setColor(n,colour,string)
  {
    debugger;
    let col = this.noteService.changeColor(n.id,colour,string);
    col.subscribe((res:any)=>{
      console.log(res);
      if (res.message == "200") 
        {
          this.displayNotes();
        } 
        else 
        {
          
        }
    })
  }
  
  openDialog(n): void {
    debugger;
    // const dialogconfg = new MatDialogConfig();
    
    // dialogconfg.autoFocus = true;
    // dialogconfg.width = "600px"
    // dialogconfg.maxHeight = "200px"
    // dialogconfg.panelClass = 'custom-dialog-container'
    // dialogconfg.data = { notesdata: n
    // }
    const open = this.dialog.open(EditnotesComponent,{
      data: n,
      autoFocus: true,
      width: '600px',
    //  maxHeight: "200px",
      panelClass: 'custom-dialog-container'
    });
    this.displayNotes();
      }

      horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  action: boolean = true;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  addExtraClass: boolean = false;
actionButtonLabel: string = 'Undo';
stat;
      openSnackbar(message:string, action: string)
      {
        let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? this.autoHide : 0;

        debugger;
        this.stat = "Note moved to trash";
        this.snackBar.open(this.stat, this.action ? this.actionButtonLabel : undefined, config);
      }


  
  notestools(id) {
    debugger
    if (id == "undefined"){
      return;
    }

    let arch = this.noteService.archiveNote(id);
    arch.subscribe((res:any)=>{
     
        if (res.message == "200") 
        {
          this.displayNotes();
        } 
        else 
        {
          
        }
    })
  }

  deleteNote(n)
  {
    if (n == "undefined"){
      return;
    }
   
    let robj = this.noteService.deleteNote(n);

      robj.subscribe((res: any) => {

        if (res.message == "200") 
        {
          this.displayNotes();
        } 
        else 
        {
          
        }
      });
  }

  closeDate()
  {
    this.timer = false;
    this.currentDateAndTime = undefined;
    
  }

  // remaindme() {

  //   var day = new Date();
  //   var fulldate =
  //   day.toDateString() + " " + (day.getHours() % 12) + ":" + day.getMinutes();
  //   fulldate = moment(fulldate).format("DD/MM/YYYY hh:mm") + " PM";
    
  //   this.note.forEach(reminder => {
  //   let DateAndTime = fulldate;
  //   this.currentDateAndTime = DateAndTime;
    
  //   if (DateAndTime == reminder.currentDateAndTime) {
    
  //   this.snackBar.open(reminder.title, "", {
  //   duration: 2000
  //   });
  //   }
  //   });

  currentDateTime
  resp
	remaindme() {
    // this.toasterservice.success("ddd", "asfasdf"); 
    debugger
		var day = new Date();
		var fulldate =
		day.toDateString() + " " + (day.getHours() % 12) + ":" + day.getMinutes();
    fulldate = moment(fulldate).format("DD/MM/YYYY hh:mm") + " PM";

    const tokens = localStorage.getItem('token');
    const tokenPayload = decode(tokens);
    const id = tokenPayload.id;
    let nobs = this.noteService.displayNote(id);
      
    nobs.subscribe((data: any) => {
       // debugger;
        this.note = data as string[];
      });

      this.note.forEach(res => {
        debugger
        this.resp = res;
        let DateAndTime = fulldate;
        this.currentDateTime = DateAndTime;
        
        console.log("remainder "+ DateAndTime);

        console.log("remainder123 "+ this.resp.date);
        /**
         * compare with present time if equal alert remainder
         */
        if (DateAndTime == this.resp.date) {
          console.log("remainder "+ this.resp.date);
          debugger

          this.snackBar.open(this.resp.title,'',{
            duration: 2000
          });
        }
       });

}

// drop(event: CdkDragDrop<string[]>) {
//   debugger;
//   moveItemInArray(this.note, event.previousIndex, event.currentIndex);

// }

/**
	 * @var difference intger having the difference
	 * @var dirrection string having the direction of drag
	 */
	difference;
  dirrection;
  resnote;
	/**
	 * @method drop
	 * @description function to drag and drop the card
	 * @param CdkDragDrop array
	 */
  drop(event: CdkDragDrop<string[]>) 
  {
    debugger
    moveItemInArray(this.note, event.previousIndex, event.currentIndex);
    
		if (event.previousIndex - event.currentIndex >= 0) {
			this.difference = event.previousIndex - event.currentIndex;
			// alert("pas");
			this.dirrection = "positive";
		} else {
			this.difference = (event.previousIndex - event.currentIndex) * -1;
			// alert("neg");
			this.dirrection = "negative";
    }
    console.log(event.currentIndex);

    console.log(this.note[event.currentIndex]);
     this.resnote = this.note[event.currentIndex];

     console.log("dargid",this.resnote.dragId);

    let obbs = this.noteService.dragAndDrop(
    	this.difference,
    	this.resnote.dragId,
    	this.dirrection,
    	this.uid
    );
    obbs.subscribe(
    	(res: any) => {
    		//   obbs.unsubscribe();
    	},
    	error => {
    		// this.iserror = true;
    		// this.errorMessage = error.message;
    	}
    );
  }


		// console.log(event.currentIndex);

		// console.log(this.notes[event.currentIndex]);

		// let obbs = this.noteService.dragAndDrop(
		// 	this.difference,
		// 	this.note[event.currentIndex].dragId,
		// 	this.dirrection,
		// 	this.email
		// );
		// obbs.subscribe(
		// 	(res: any) => {
		// 		//   obbs.unsubscribe();
		// 	},
    // );
    
  
// difference;
//   dirrection;
// 	/**
// 	 * @method drop
// 	 * @description function to drag and drop the card
// 	 * @param CdkDragDrop array
// 	 */
//   drop(event: CdkDragDrop<string[]>) {
//     debugger
//     moveItemInArray(this.note, event.previousIndex, event.currentIndex);
//     if (event.previousIndex - event.currentIndex >= 0) {
//       this.difference = event.previousIndex - event.currentIndex;
//       // alert("pas");
//       this.dirrection = "positive";
//     } else {
//       this.difference = (event.previousIndex - event.currentIndex) * -1;
//       // alert("neg");
//       this.dirrection = "negative";
//   }
//  }

public base64textString;
  Mainimage;
  imageNoteId;
  imgres;
  onSelectImage(event,noteId){
    debugger;
		this.imageNoteId = noteId;
		var files = event.target.files;
		var file = files[0];
		if (files && file) {
			var reader = new FileReader();
			reader.onload = this._handleReaderLoaded.bind(this);
			reader.readAsBinaryString(file);
		}
  }

  _handleReaderLoaded(readerEvt) {
    debugger
		var binaryString = readerEvt.target.result;
		console.log(binaryString);
		this.base64textString = btoa(binaryString);
		this.note.forEach(element => {
      this.imgres = element;
			if (this.imgres.id == this.imageNoteId) {
        this.imgres.image = "data:image/jpeg;base64," + this.base64textString;
        this.image = this.imgres.image;
        let obss = this.noteService.addUserImage(this.image,this.imageNoteId);
      
      obss.subscribe((res: any) => {});
			}
		});

		if (this.imageNoteId == "01") {
      this.Mainimage = "data:image/jpeg;base64," + this.base64textString;
      this.image = this.Mainimage;
      debugger;
      console.log(this.image);
      
		} else {
      
	 }
  }
  
  pinNote(id,n) {
    debugger;
    
      let pinnote = this.noteService.pinNote(id,n);
      
      pinnote.subscribe((pin:any)=>{
        this.displayNotes();
        this.notes = pin;
      }) 
			// obs.subscribe((res: any) => {
			// 	debugger;
			// 	this.notes = res;
			// 	// obs.unsubscribe();
			// });
		
  }
  
  displayLabels() {
    debugger;
    let fetchl = this.labelser.displayLabels(this.uid);

    fetchl.subscribe((res: any) => {
      debugger

      this.labels = res;
    })
  }

  addLabelToNote(item,n)
  {
    debugger
    this.model = {
      "note_id":n.id,
      "label_id":item.id
    }

    let addln = this.labelser.addLabelToNote(this.model);

    addln.subscribe((resaln:any)=>{
      console.log("addlabeltonote",resaln);
      if (resaln.message == "200") 
        {
          this.displayNotes();
        } 
        else 
        {
          
        }
    })

  }

  closeLabel(n)
  {
    this.model = {
      "id":n.id,
      "label":n.label
    }
    let closel = this.noteService.closeLabel(this.model);

    closel.subscribe((resdlfn:any)=>{
      console.log("deletelabeltonote",resdlfn);
      if (resdlfn.message == "200") 
        {
          this.displayNotes();
        } 
        else 
        {
          
        }
    })

  }

}
