export const clearBlankDate = (obj) =>{
    let newObj = {};
    if (typeof obj == "string") {
        obj = JSON.parse(obj);
    }
    if (obj instanceof Array) {
        newObj = [];
    }
    if (obj instanceof Object) {
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr) && obj[attr] !== "" && obj[attr] !== null && obj[attr] !== undefined) {
                if (obj[attr] instanceof Object) {
                    newObj[attr] = clearBlankDate(obj[attr]);
                } else if (typeof obj[attr] == "string" && ((obj[attr].indexOf("{") > -1 && obj[attr].indexOf("}") > -1) || (obj[attr].indexOf("[") > -1 && obj[attr].indexOf("]") > -1))) {
                    try {
                        let attrObj = JSON.parse(obj[attr]);
                        if (attrObj instanceof Object) {
                            newObj[attr] = clearBlankDate(attrObj);
                        }
                    } catch (e) {
                        newObj[attr] = obj[attr];
                    }
                } else {
                    newObj[attr] = obj[attr];
                }
            }
        }
    }
    return newObj;
}

export const mergeJsonObject =(jsonbject1,jsonbject2)=>{
    let resultJsonObject={};
    for(let attr in jsonbject1){
        resultJsonObject[attr]=jsonbject1[attr];
    }
    for(let attr2 in jsonbject2){
        resultJsonObject[attr2]=jsonbject2[attr2];
    }
    return resultJsonObject;
}

export default {
    clearBlankDate,mergeJsonObject
}
