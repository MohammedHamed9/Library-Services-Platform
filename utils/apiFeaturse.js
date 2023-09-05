class apiFeatures{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString
    }

    filter(){
        const queryObj={...this.queryString}
        const excludedFields=['page','limit','sort','fields'];
        excludedFields.forEach(el=>{
            delete queryObj[el]
        });
        const queryStr=JSON.stringify(queryObj).replace(/\b(gt|gte|lt|lte)\b/g,(match)=>{return`$${match}`});
        this.query=this.query.find(JSON.parse(queryStr));
        return this
    }
    
    sort(){
        if(this.queryString.sort){
            const sortBy=this.queryString.sort.split(',').join(' ');
            this.query=this.query.sort(sortBy);
        }
        return this
    }
    limitFields(){
    if(this.queryString.fields){
        const fields=this.queryString.fields.split(',').join(' ');
        this.query=this.query.select(fields);
    }
    else{
        this.query.select('-__v');
        return this
    }
    return this

}
    paginate(){
if(this.queryString.page){
    const page=this.queryString.page*1||1
    const limit=this.queryString.limit*1||100
    const skip=(page-1)*limit
    this.query=this.query.skip(skip).limit(limit);
    return this
}
}
}
module.exports=apiFeatures