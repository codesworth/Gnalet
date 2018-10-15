import * as functions from  'firebase-functions';
import * as admin from 'firebase-admin';


admin.initializeApp();

const rsettings = {timestampsInSnapshots:true};
admin.firestore().settings(rsettings);


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const REF_REPORTERS = "GN-REPORTERS";
const REF_REPORTS = "GN-REPORTS";
const REF_AUTHORITIES = "GN-Authorities";
const REF_TOKENS = "TOKENS";
const REF_ANALYTICS = "GN-ANALYTICS"
const FIELD_SUPBODY = "supBody";
const FIELD_CATEGORY = "category";
const FIELD_UNSOLVED = "unsolved";
const FIELD_SOLVED = "solved";
const FIELD_PENDING = "pending";
const FIELD_FLAGGED = "flag";
const VEHICULAR = "VEHICULAR";
const SANITATION = "SANITATION";
const CRIMES =   "CRIMES";
const REF_MONTHS = "Months";
const WATER =     "WATER";
const POTHOLES = "POTHOLES";
const ECG = "ECG";
const HFDA =   "HFDA";
const OTHERS = "OTHERS";

const  CASE_EMAIL = "email";
const  CASE_PHONE = "phone";
const CASE_DESC = "description";
const CASE_LOCATION = "location";
const CASE_LONGITUDE = "longitude";
const CASE_LATITUDE = "latitude";
const CASE_IMGLNK = "link";
const CASE_SUP_BODY = "supBody";
const CASE_STATUS = "status";
const CASE_REPORTER = "Reporter";
const CASE_UP_VOTES = "ups";
const  CASE_DOWN_VOTES = "downs";
const USER_UID__ = "uid";
const DID_LOG_IN_ = "LoggedIn";
const REF_ID_USERNAME = "username";
const REF_ID_IMG_LNK = "link";
const REF_GC_POINTS = "gcpoints";
const _DATE = "date";




export const analyticsOnAdd = functions.firestore.document(`${REF_REPORTS}/{dcId}`).onCreate(async (snap,context)=>{
    
    const category = snap.get(FIELD_CATEGORY);
    const sup = snap.get(FIELD_SUPBODY);
    const month = returnMonthYear(null);
    try{

        return admin.firestore().runTransaction(async transaction => {
            const aref = admin.firestore().doc(`${REF_ANALYTICS}/${category}`)
            const mref = admin.firestore().doc(`${REF_ANALYTICS}/${category}/${REF_MONTHS}/${month}`);
            const analyticdata = await transaction.get(aref);
            const analyticmonth = await transaction.get(mref);
            if(!analyticdata.exists){
                throw({message:"Document data does not exist"});
                
            }
            const supdata = analyticdata.get(sup);
            const msupdata = analyticmonth.get(sup);
            const unsolved:number = supdata[FIELD_UNSOLVED];
            const munsolved:number = msupdata[FIELD_UNSOLVED] + 1;
            const newvalve = unsolved + 1;
            supdata[FIELD_UNSOLVED] = newvalve;
            msupdata[FIELD_UNSOLVED] = munsolved;
            transaction.update(aref,{[sup]:supdata});
            transaction.set(mref,{[sup]:msupdata},{merge:true});
        });
        
        
    }catch(e){
        console.log("Error happened with sig: ",e);
        return Promise.reject(e);
    }
});

export const reportWasUpdated = functions.firestore.document(`${REF_REPORTS}/{dcId}`).onUpdate(async (snap,context)=> {

    const befdoc = snap.before;
    const after = snap.after;
    const uid = befdoc.get("uid");
    const oldstatus:number = befdoc.get(CASE_STATUS);
    const newstatus:number = after.get(CASE_STATUS);
    const oldcat = befdoc.get(FIELD_CATEGORY);
    const afcat = after.get(FIELD_CATEGORY);
    const sup = after.get(FIELD_SUPBODY);
    const ts = after.get('ts');
    const month = returnMonthYear(ts)
    try{
        if(oldcat !== afcat){
            await admin.firestore().runTransaction(async transaction => {
                const aref = admin.firestore().doc(`${REF_ANALYTICS}/${oldcat}`);
                const mref = admin.firestore().doc(`${REF_ANALYTICS}/${oldcat}/${REF_MONTHS}/${month}`);
                const newaref = admin.firestore().doc(`${REF_ANALYTICS}/${afcat}`);
                const newmref = admin.firestore().doc(`${REF_ANALYTICS}/${afcat}/${REF_MONTHS}/${month}`);
                const analyticdata = await transaction.get(aref);
                const analyticmonth = await transaction.get(mref);
                const newanalyticdata = await transaction.get(aref);
                const newanalyticmonth = await transaction.get(mref);
                const beforenum = analyticdata.get(sup)[getStatusString(oldstatus)] - 1;
                const mbeforenum = analyticmonth.get(sup)[getStatusString(oldstatus)] - 1;
                const afternum = newanalyticdata.get(sup)[getStatusString(oldstatus)] - 1;
                const mafternum = newanalyticmonth.get(sup)[getStatusString(oldstatus)] - 1;
                const upd = analyticdata.get(sup);
                const mupd = analyticmonth.get(sup);
                const newupd = newanalyticdata.get(sup);
                const newmupd = newanalyticmonth.get(sup);
                upd[getStatusString(oldstatus)] = beforenum;
                mupd[getStatusString(oldstatus)] = mbeforenum;
                newupd[getStatusString(oldstatus)] = afternum;
                newmupd[getStatusString(oldstatus)] = mafternum;
                transaction.update(aref,{[sup]:upd});
                transaction.update(mref,{[sup]:mupd});
                transaction.update(newmref,{[sup]:newmupd})
                transaction.update(newaref,{[sup]:newupd})

            });
        }
        if(oldstatus !== newstatus){
            await admin.firestore().runTransaction(async transaction =>{
                const aref = admin.firestore().doc(`${REF_ANALYTICS}/${afcat}`);
                const mref = admin.firestore().doc(`${REF_ANALYTICS}/${oldcat}/${REF_MONTHS}/${month}`);
                const analyticdata = await transaction.get(aref);
                const analyticmonth = await transaction.get(mref);
                const beforenum = analyticdata.get(sup)[getStatusString(oldstatus)] - 1;
                const afternum = analyticdata.get(sup)[getStatusString(newstatus)] + 1;
                const mbeforenum = analyticmonth.get(sup)[getStatusString(oldstatus)] - 1;
                const mafternum = analyticmonth.get(sup)[getStatusString(newstatus)] + 1;
                const upd = analyticdata.get(sup);
                const mupd = analyticmonth.get(sup);
                upd[getStatusString(oldstatus)] = beforenum;
                upd[getStatusString(newstatus)] = afternum;
                mupd[getStatusString(oldstatus)] = mbeforenum;
                mupd[getStatusString(newstatus)] = mafternum
                transaction.update(mref,{[sup]:mupd});
                transaction.update(aref,{[sup]:upd});

            })
        }

        const tokensnap = await admin.firestore().collection(REF_TOKENS).doc(uid).get();
        const token = tokensnap.data().token;

        const status:number = after.get("status");
        if (status === 1){
            const payload = {
                notification: {
                    title: "REPORT UPDATE",
                    body: `Your reported issue has been updated to Pending by the ${sup}`,
                    badge: '1',
                    sound: 'default'

                }
            };
            return admin.messaging().sendToDevice(token,payload);
        }else if (status === 2){
            const payload = {
                notification: {
                    title: "REPORT UPDATE",
                    body: `Your reported issue has been Resolved by the ${sup}`,
                    badge: '1',
                    sound: 'default'

                }
            };
            return admin.messaging().sendToDevice(token,payload);
        }else {
            return Promise.resolve("Nothing");
        }

        

    }catch(e){
        //const ref:admin.firestore.Query = admin.firestore().collection('').where()
        console.log("Error occurred with signature",e);
        return Promise.reject(e);
    }

    

});


export const deletedDocument = functions.firestore.document(`${REF_REPORTS}/{docId}`).onDelete( async (snap,context) =>{

    const status = snap.get(CASE_STATUS);
    const category = snap.get(FIELD_CATEGORY);
    const sup = snap.get(FIELD_SUPBODY);

    try{
        if(status > 3){
            const analytic = await admin.firestore().doc(`${REF_ANALYTICS}/${category}`).get();
            const supdata = analytic.get(sup);
            const newflagnum = supdata[getStatusString(status)] - 1;
            supdata[getStatusString(status)] = newflagnum;
            const wr = await admin.firestore().doc(`${REF_ANALYTICS}/${category}`).update({[sup]:supdata});
            return Promise.resolve(wr);
        }else{
            return Promise.resolve();
        }
    }catch(e){
        console.log("Error occurred with sig: ",e);
        return Promise.reject(e);
    }
});






// https.onRequest(async (request, response) =>{

//     const supBody = request.params.supbody
//     const category = request.params.category;

//     try{
//         console.log(request.params);
//         const allqueries = await fireadmin.firestore().collection(REF_CASES).where("supBody", "==", supBody).where("name", "==", category).get();
//         const total = allqueries.docs.length;
//         response.status(200).send(total);
//     }

//     catch(err){
//         console.log("An error occurred with Signature: " + err);
//         response.status(404).send("Bad request, Invalid Params");
//     }
// })


function returnMonthYear(ts?:number):string{
    let date;
    if(ts === null){
        date = new Date();
    }else{
        date = new Date(ts)
    } 
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const val = String(year).concat("-").concat(String(month));
    return val;
}

function getWeekNumber(d) {
    // Copy date so don't modify original
    //d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    console.log(d);
    
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart:any = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}

function getStatusString(status:number):string{
    switch (status){
        case 0:
            return FIELD_UNSOLVED;
        case 1:
            return FIELD_PENDING
        case 2:
            return FIELD_SOLVED
        default:
            return FIELD_FLAGGED
            
    }
}



async function fetchDocBy(uid:string) {
    return admin.firestore().doc(uid).get();
}


export const resetToZero = functions.https.onRequest(async (request,response) => {
    const date = returnMonthYear();
    const batch = admin.firestore().batch();

    //const r = getWeekNumber(new Date());
    //console.log(date+' The week stuff are',r);
    
    try{
        const data = {
            AMA:{
                unsolved:0,
                pending: 0,
                solved: 0,
                flag: 0
            },
            TMA:{
                unsolved:0,
                pending: 0,
                solved: 0,
                flag: 0
            }
        }

        const cats = [VEHICULAR ,
            SANITATION,
            CRIMES,  
        
            WATER,   
            POTHOLES,
            ECG,
            HFDA,
            OTHERS]
            cats.forEach(cat => {
                batch.set(admin.firestore().doc(`${REF_ANALYTICS}/${cat}`),data,{merge:true}); 
            });
        
        const years = ["2018-10","2018-11","2018-12","2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10"];
        const docs = await admin.firestore().collection(REF_ANALYTICS).get();
        docs.forEach( doc =>{
            const id = doc.id;
            years.forEach( key => {
                let ref = admin.firestore().collection(REF_ANALYTICS).doc(id).collection("Months").doc(key);
                batch.set(ref,data,{merge:true});
            });
        });

        const write = await batch.commit();
        response.status(200).send(write);

    }catch(e){
        console.log(e);
        response.status(504).send(e);
        
    }
   
    
    
})



/**
 * FUnctions tests
 */
/*
export const callTestFroDate = functions.https.onRequest(async (request,response) => {
    const date = returnMonthYear();
    const batch = admin.firestore().batch();

    const r = getWeekNumber(new Date());
    console.log(date+' The week stuff are',r);
    try{
        const data = {
            AMA:{
                unsolved:0,
                pending: 0,
                solved: 0,
                flag: 0
            },
            TMA:{
                unsolved:0,
                pending: 0,
                solved: 0,
                flag: 0
            }
        }
        const years = ["2018-10","2018-11","2018-12","2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10"];
        const docs = await admin.firestore().collection(REF_ANALYTICS).get();
        docs.forEach( doc =>{
            const id = doc.id;
            years.forEach( key => {
                let ref = admin.firestore().collection(REF_ANALYTICS).doc(id).collection("Months").doc(key);
                batch.set(ref,data,{merge:true});
            });
        });

        const write = await batch.commit();
        response.status(200).send(write);

    }catch(e){
        console.log(e);
        response.status(504).send(e);
        
    }
   
    
    
})*/