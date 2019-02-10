"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
function testDuplicates(store, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const batch = store.batch();
        const months = [];
        try {
            const snapdata = yield store.collection(Constants_1.REF_ANALYTICS).get();
            snapdata.docs.forEach(element => {
                const data = element.data();
                for (const key in data) {
                    const val = data[key];
                    val[Constants_1.FIELD_DUPLICATE] = 0;
                    data[key] = val;
                }
                batch.update(element.ref, data);
                months.push(store.collection(`${Constants_1.REF_ANALYTICS}/${element.id}/${Constants_1.REF_MONTHS}/`));
            });
            for (const colref of months) {
                const coldata = yield colref.get();
                coldata.docs.forEach(celement => {
                    const cdata = celement.data();
                    for (const key in cdata) {
                        const val = cdata[key];
                        val[Constants_1.FIELD_DUPLICATE] = 0;
                        cdata[key] = val;
                    }
                    batch.update(celement.ref, cdata);
                });
            }
            const resp = yield batch.commit();
            response.status(200).send(resp);
        }
        catch (e) {
            console.log("Error occurred with sig: ", e);
            response.status(504).send(e);
        }
    });
}
exports.testDuplicates = testDuplicates;
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
//# sourceMappingURL=Tests.js.map