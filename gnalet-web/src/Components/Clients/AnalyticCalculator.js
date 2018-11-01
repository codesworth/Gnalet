
import {AN_TOTALS, AN_YEAR_DATA, FIELD_SOLVED, FIELD_FLAGGED, FIELD_DUPLICATE} from '../../Helpers/Constants'

function makeAnalyticForCategoryData(category){
    const data = {
        pending:0,unsolved:0,solved:0,flag:0, duplicate:0
    }
    //console.log("Initial data: ", data);
    let alltotal = 0;
    for (const id in data){
        let total = 0;
        for (const region in category){
            if(region !== 'key'){
                const value = category[region];
                if (typeof(value) == 'object'){
                    total  = total + value[id]
                }
            }
        }
        data[id] = total;
    }
    data.key = category.key;
    const {pending,unsolved,solved,flag,duplicate} = data;
    alltotal = pending + unsolved + solved + flag + duplicate;
    let comp = ((solved) / (alltotal - flag)) * 100;
    if (solved === 0 || (alltotal - (flag + duplicate)) === 0){
        comp = 0;
    }
    data.completion = comp.toFixed(2)
    data.total = alltotal
    return data;
}


export function makeBigdataAnalytics(bigdata){
    const retdata = {}
    const data = []
    const totals = {pending:0,unsolved:0,solved:0,flag:0,total:0, duplicate:0}
    bigdata.forEach(element => {
        //console.log("The eleemt is: ", element);
        const catdata = makeAnalyticForCategoryData(element);
        for (const key in totals){
            let val = totals[key];
            val = val + catdata[key];
            totals[key] = val;
        }
        data.push(catdata);
    });
    let comp = (totals[FIELD_SOLVED]) / (totals.total - (totals[FIELD_FLAGGED] + totals[FIELD_DUPLICATE])) * 100
    if ((totals[FIELD_SOLVED]) === 0 || (totals.total - (totals[FIELD_FLAGGED] + totals[FIELD_DUPLICATE])) === 0){
        comp = 0
    }

    totals.completion = comp.toFixed(1);
    retdata[AN_YEAR_DATA] = data;
    retdata[AN_TOTALS] = totals;
    
    return retdata;
}


function collapseAllTotals(data){
    const totals = {pending:0,unsolved:0,solved:0,flag:0}

}